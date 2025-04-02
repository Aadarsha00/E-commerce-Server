import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface IMailOptions {
  to: string;
  subject: string;
  html: string;
}
export const sendEmail = async (mailOptions: IMailOptions) => {
  const mailOption = {
    from: `"${process.env.MAIL_FROM}"<${process.env.SMTP_EMAIL}>`,
    to: mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.html,
  };
  await transporter.sendMail(mailOption);
};
