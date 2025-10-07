import nodemailer from 'nodemailer';
import { SMTP } from '../constants/constants.js';
import getEnvVar from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

export default async function sendEmail(options) {
  return await transporter.sendMail(options);
}
