import { createTransport } from "nodemailer";

const sender = process.env.NODEMAILER_EMAIL;
const password = process.env.NODEMAILER_EMAIL_PASSWORD;

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: sender,
    pass: password,
  },
});
