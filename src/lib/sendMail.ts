import nodemailer from 'nodemailer';

type MailPayload = {
  to: string;
  subject: string;
  message: string;
};

export const sendMail = async ({ to, subject, message }: MailPayload) => {
  if (!to || !subject || !message) {
    throw new Error('Missing required fields');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Region-Based-Verification" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `<div style="font-family:sans-serif;"><p>${message}</p></div>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
