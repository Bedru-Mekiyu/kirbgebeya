import models from "./models/donation.models.js";
import sequelize from "../../config/db.js";
const { Donor, Donation, Payment, Campaign } = models;
import { Chapa } from "chapa-nodejs";

import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

export const getAllPayments = async () => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Donation,
          as: "donation",
          include: [
            {
              model: Donor,
              as: "donor",
              attributes: [
                "id",
                "donorIdentityNumber",
                "firstName",
                "lastName",
                "email",
              ],
            },
            {
              model: Campaign,
              as: "campaign",
              attributes: ["id", "title"],
            },
          ],
          attributes: [
            "id",
            "totalAmount",
            "donationType",
            "dedication",
            "anonymous",
            "createdAt",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return payments.map((payment) => ({
      id: payment.id,
      donationId: payment.donationId,
      paymentMethod: payment.paymentMethod,
      cardNumber: payment.cardNumber,
      expiryDate: payment.expiryDate,
      nameOnCard: payment.nameOnCard,
      amount: payment.amount || payment.donation?.totalAmount || 0,
      status: payment.status,
      tx_ref: payment.tx_ref,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      donation: payment.donation
        ? {
          id: payment.donation.id,
          totalAmount: payment.donation.totalAmount,
          donationType: payment.donation.donationType,
          dedication: payment.donation.dedication,
          anonymous: payment.donation.anonymous,
          donor: payment.donation.donor,
          campaign: payment.donation.campaign,
        }
        : null,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }
};

export const processChapaWebhook = async (payload) => {
  try {
    const { tx_ref, status, reference, method } = payload;

    const payment = await Payment.findOne({ where: { tx_ref } });
    if (!payment) {
      return {
        success: false,
        exists: false,
        message: "Payment record not found.",
      };
    }

    if (status === "success") {
      if (payment.status !== "completed") {
        await Payment.update(
          {
            status: "completed",
            externalReference: reference,
            paymentMethod: method || "Chapa",
          },
          { where: { tx_ref } }
        );
      }
      return { success: true, exists: true, message: "Payment completed." };
    } else {
      if (payment.status !== "failed") {
        await Payment.update({ status: "failed" }, { where: { tx_ref } });
      }
      return { success: false, exists: true, message: "Payment failed." };
    }
  } catch (err) {
    console.error("Webhook Payment Service Error:", err);
    return { success: false, message: "Internal server error.", error: err.message || err, };
  }
};



export const getPaymentById = async (id) => {
  try {
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Donation,
          as: "donation",
          include: [
            {
              model: Donor,
              as: "donor",
              attributes: [
                "id",
                "donorIdentityNumber",
                "firstName",
                "lastName",
                "email",
                "phone",
              ],
            },
            {
              model: Campaign,
              as: "campaign",
              attributes: ["id", "title"],
            },
          ],
          attributes: [
            "id",
            "totalAmount",
            "donationType",
            "dedication",
            "anonymous",
            "createdAt",
          ],
        },
      ],
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return {
      id: payment.id,
      donationId: payment.donationId,
      paymentMethod: payment.paymentMethod,
      cardNumber: payment.cardNumber,
      expiryDate: payment.expiryDate,
      nameOnCard: payment.nameOnCard,
      amount: payment.amount || payment.donation?.totalAmount || 0,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      donation: payment.donation
        ? {
          id: payment.donation.id,
          totalAmount: payment.donation.totalAmount,
          donationType: payment.donation.donationType,
          dedication: payment.donation.dedication,
          anonymous: payment.donation.anonymous,
          donor: payment.donation.donor,
          campaign: payment.donation.campaign,
        }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};

export const getPaymentStats = async () => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Donation,
          as: "donation",
          attributes: ["totalAmount"],
        },
      ],
    });

    const totalPayments = payments.length;
    const completedPayments = payments.filter(
      (p) => p.status === "completed"
    ).length;
    const pendingPayments = payments.filter(
      (p) => p.status === "pending"
    ).length;
    const failedPayments = payments.filter((p) => p.status === "failed").length;

    const totalAmount = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, payment) => {
        const amount = payment.amount || payment.donation?.totalAmount || 0;
        return sum + amount;
      }, 0);

    const refundedAmount = payments
      .filter((p) => p.status === "refunded")
      .reduce((sum, payment) => {
        const amount = payment.amount || payment.donation?.totalAmount || 0;
        return sum + amount;
      }, 0);

    const averageAmount =
      completedPayments > 0 ? totalAmount / completedPayments : 0;

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalAmount,
      averageAmount,
      refundedAmount,
    };
  } catch (error) {
    throw new Error(`Failed to fetch payment statistics: ${error.message}`);
  }
};

export const updatePaymentStatus = async (id, status) => {
  const transaction = await sequelize.transaction();
  try {
    const payment = await Payment.findByPk(id, { transaction });
    if (!payment) {
      throw new Error("Payment not found");
    }

    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid payment status");
    }

    const previousStatus = payment.status;
    await payment.update({ status }, { transaction });

    if (status === "completed" && previousStatus !== "completed") {
      const donation = await Donation.findByPk(payment.donationId, {
        transaction,
      });
      if (donation) {
        await donation.update({ status: "completed" }, { transaction });
      }
    }

    if (status === "failed" && previousStatus !== "failed") {
      const donation = await Donation.findByPk(payment.donationId, {
        transaction,
      });
      if (donation) {
        await donation.update({ status: "failed" }, { transaction });
      }
    }

    await transaction.commit();

    return await getPaymentById(id);
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Failed to update payment status: ${error.message}`);
  }
};

export const processRefund = async (id, refundAmount) => {
  const transaction = await sequelize.transaction();
  try {
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Donation,
          as: "donation",
          attributes: ["totalAmount"],
        },
      ],
      transaction,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "completed") {
      throw new Error("Only completed payments can be refunded");
    }

    const paymentAmount = payment.amount || payment.donation?.totalAmount || 0;
    const actualRefundAmount = refundAmount || paymentAmount;

    if (actualRefundAmount > paymentAmount) {
      throw new Error("Refund amount cannot exceed original payment amount");
    }

    await payment.update(
      {
        status: "refunded",
        amount: paymentAmount - actualRefundAmount,
      },
      { transaction }
    );

    if (actualRefundAmount === paymentAmount) {
      const donation = await Donation.findByPk(payment.donationId, {
        transaction,
      });
      if (donation) {
        await donation.update({ status: "refunded" }, { transaction });
      }
    }

    await transaction.commit();

    const refundRecord = {
      id: uuidv4(),
      paymentId: id,
      amount: actualRefundAmount,
      refundDate: new Date(),
      status: "processed",
    };

    return {
      ...refundRecord,
      payment: await getPaymentById(id),
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Failed to process refund: ${error.message}`);
  }
};

export const downloadReceipt = async (id) => {
  try {
    const payment = await getPaymentById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "completed") {
      throw new Error("Receipt can only be generated for completed payments");
    }

    const receiptData = {
      receiptId: `RCP-${payment.id.slice(0, 8).toUpperCase()}`,
      paymentDate: payment.createdAt,
      transactionId: payment.transactionId || payment.id,
      donorName: payment.donation?.anonymous
        ? "Anonymous"
        : `${payment.donation?.donor?.firstName} ${payment.donation?.donor?.lastName}`,
      donorEmail: payment.donation?.donor?.email,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      donationType: payment.donation?.donationType,
      campaign: payment.donation?.campaign?.title || "General Donation",
      dedication: payment.donation?.dedication,
    };

    return receiptData;
  } catch (error) {
    throw new Error(`Failed to generate receipt: ${error.message}`);
  }
};

export const searchPayments = async (query) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Donation,
          as: "donation",
          include: [
            {
              model: Donor,
              as: "donor",
              where: {
                [Op.or]: [
                  { firstName: { [Op.iLike]: `%${query}%` } },
                  { lastName: { [Op.iLike]: `%${query}%` } },
                  { email: { [Op.iLike]: `%${query}%` } },
                  { donorIdentityNumber: { [Op.iLike]: `%${query}%` } },
                ],
              },
              attributes: [
                "id",
                "donorIdentityNumber",
                "firstName",
                "lastName",
                "email",
              ],
            },
            {
              model: Campaign,
              as: "campaign",
              where: {
                title: { [Op.iLike]: `%${query}%` },
              },
              attributes: ["id", "title"],
            },
          ],
          attributes: [
            "id",
            "totalAmount",
            "donationType",
            "dedication",
            "anonymous",
            "createdAt",
          ],
        },
      ],
      where: {
        [Op.or]: [
          { transactionId: { [Op.iLike]: `%${query}%` } },
          { id: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    return payments.map((payment) => ({
      id: payment.id,
      donationId: payment.donationId,
      paymentMethod: payment.paymentMethod,
      cardNumber: payment.cardNumber,
      expiryDate: payment.expiryDate,
      nameOnCard: payment.nameOnCard,
      amount: payment.amount || payment.donation?.totalAmount || 0,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      donation: payment.donation
        ? {
          id: payment.donation.id,
          totalAmount: payment.donation.totalAmount,
          donationType: payment.donation.donationType,
          dedication: payment.donation.dedication,
          anonymous: payment.donation.anonymous,
          donor: payment.donation.donor,
          campaign: payment.donation.campaign,
        }
        : null,
    }));
  } catch (error) {
    throw new Error(`Failed to search payments: ${error.message}`);
  }
};

export const getRecentPayments = async (limit = 10) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Donation,
          as: "donation",
          include: [
            {
              model: Donor,
              as: "donor",
              attributes: [
                "id",
                "donorIdentityNumber",
                "firstName",
                "lastName",
                "email",
              ],
            },
            {
              model: Campaign,
              as: "campaign",
              attributes: ["id", "title"],
            },
          ],
          attributes: [
            "id",
            "totalAmount",
            "donationType",
            "dedication",
            "anonymous",
            "createdAt",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    return payments.map((payment) => ({
      id: payment.id,
      donationId: payment.donationId,
      paymentMethod: payment.paymentMethod,
      cardNumber: payment.cardNumber,
      expiryDate: payment.expiryDate,
      nameOnCard: payment.nameOnCard,
      amount: payment.amount || payment.donation?.totalAmount || 0,
      status: payment.status,
      tx_ref: payment.tx_ref,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      donation: payment.donation
        ? {
          id: payment.donation.id,
          totalAmount: payment.donation.totalAmount,
          donationType: payment.donation.donationType,
          dedication: payment.donation.dedication,
          anonymous: payment.donation.anonymous,
          donor: payment.donation.donor,
          campaign: payment.donation.campaign,
        }
        : null,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch recent payments: ${error.message}`);
  }
};

export const getPaymentsByStatus = async (status) => {
  try {
    const payments = await Payment.findAll({
      where: { status },
      include: [
        {
          model: Donation,
          as: "donation",
          include: [
            {
              model: Donor,
              as: "donor",
              attributes: [
                "id",
                "donorIdentityNumber",
                "firstName",
                "lastName",
                "email",
              ],
            },
          ],
          attributes: ["id", "totalAmount", "donationType", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return payments;
  } catch (error) {
    throw new Error(`Failed to fetch payments by status: ${error.message}`);
  }
};

export const getPaymentsByDateRange = async (startDate, endDate) => {
  try {
    const payments = await Payment.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      include: [
        {
          model: Donation,
          as: "donation",
          include: [
            {
              model: Donor,
              as: "donor",
              attributes: [
                "id",
                "donorIdentityNumber",
                "firstName",
                "lastName",
                "email",
              ],
            },
          ],
          attributes: ["id", "totalAmount", "donationType", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return payments;
  } catch (error) {
    throw new Error(`Failed to fetch payments by date range: ${error.message}`);
  }
};
