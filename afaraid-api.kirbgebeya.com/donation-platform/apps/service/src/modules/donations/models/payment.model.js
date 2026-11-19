import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Payment = sequelize.define(
    "Payment",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false,
        },

        donationId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        provider: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Payment provider name (e.g., chapa, stripe, paypal, telebirr)",
        },

        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Payment method used (e.g., card, mobile_money, bank_transfer)",
        },

        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        currency: {
            type: DataTypes.STRING,
            defaultValue: "ETB",
        },

        tx_ref: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            comment: "Transaction reference from your system or provider",
        },

        externalReference: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Reference returned by the external payment provider",
        },

        status: {
            type: DataTypes.ENUM("pending", "completed", "failed", "cancelled", "refunded"),
            defaultValue: "pending",
            allowNull: false,
        },

        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: "Stores gateway-specific data or logs (response, error info, etc.)",
        },
    },
    {
        tableName: "payments",
        timestamps: true,
        indexes: [{ fields: ["tx_ref"] }, { fields: ["provider"] }],
    }
);

export default Payment;
