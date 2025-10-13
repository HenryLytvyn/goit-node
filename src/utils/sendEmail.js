import nodemailer from 'nodemailer';
import { SMTP } from '../constants/constants.js';

const transporter = nodemailer.createTransport({
  host: SMTP.SMTP_HOST,
  port: Number(SMTP.SMTP_PORT),
  auth: {
    user: SMTP.SMTP_USER,
    pass: SMTP.SMTP_PASSWORD,
  },
});

export default async function sendEmail(options) {
  return await transporter.sendMail(options);
}
