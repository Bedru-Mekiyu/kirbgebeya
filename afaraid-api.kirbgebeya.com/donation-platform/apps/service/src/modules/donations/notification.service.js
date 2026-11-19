import models from "./models/donation.models.js";
const { Notification, Donor } = models;

import { sendEmail } from "./email.service.js";

export const createNotification = async ({
  recipientType,
  recipientId,
  title,
  message,
  type,
  channel = ["email"],
  isFirstTimeDonor = false,
  donationData = null,
}) => {
  const notification = await Notification.create({
    recipientType,
    recipientId,
    title,
    message,
    type,
    channel,
  });

  if (channel.includes("email") && recipientType === "donor" && recipientId) {
    const donor = await Donor.findByPk(recipientId);
    if (donor?.email) {
      let emailHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <p>${message}</p>
        <p style="margin-top:20px;">Warm regards,<br /><strong>AfarAid Team</strong></p>
      </div>`;

      if (type === "donation" && donationData) {
        emailHtml = isFirstTimeDonor
          ? `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
               <h2 style="color:#2E86C1;">Thank You for Your Generous Donation, ${donor.firstName}!</h2>
               <p>We have successfully received your donation of <strong>${donationData.totalAmount} ETB</strong>.</p>
               <p>Your unique Donor Identity Number is:</p>
               <p style="font-size:18px;font-weight:bold;color:#1F618D;">${donor.donorIdentityNumber}</p>
               <p>Please use this number in future donations or correspondence.</p>
               <p>Thank you for supporting our mission!</p>
               <p style="margin-top:20px;">Warm regards,<br /><strong>AfarAid Team</strong></p>
             </div>`
          : `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
               <h2 style="color:#2E86C1;">Thank You for Your Continued Support, ${donor.firstName}!</h2>
               <p>We have received your donation of <strong>${donationData.totalAmount} ETB</strong>.</p>
               <p>Please continue using your existing Donor Identity Number:</p>
               <p style="font-size:18px;font-weight:bold;color:#1F618D;">${donor.donorIdentityNumber}</p>
               <p>Using this number helps us track your contributions efficiently.</p>
               <p>We deeply appreciate your ongoing support.</p>
               <p style="margin-top:20px;">Warm regards,<br /><strong>AfarAid Team</strong></p>
             </div>`;
      }

      await sendEmail({ to: donor.email, subject: title, html: emailHtml });
    }
  }

  return notification;
};
