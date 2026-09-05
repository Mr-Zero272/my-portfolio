'use server';

import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST ?? 'smtp.gmail.com';
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SMTP_SERVER_PORT = Number(process.env.SMTP_SERVER_PORT ?? 587);
// Implicit TLS (`secure: true`) is only valid on port 465. Port 587 uses
// STARTTLS (plain connection that upgrades), so `secure` must be false there.
// Override with SMTP_SERVER_SECURE=true if your provider differs.
const SMTP_SERVER_SECURE = process.env.SMTP_SERVER_SECURE
  ? process.env.SMTP_SERVER_SECURE === 'true'
  : SMTP_SERVER_PORT === 587;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: SMTP_SERVER_PORT,
  secure: SMTP_SERVER_SECURE,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error('SMTP verification failed', SMTP_SERVER_USERNAME, error);
    return;
  }

  // When both `text` and `html` are present nodemailer builds a
  // multipart/alternative message; when only `html` is present it sends
  // `text/html`. Never send an empty html — pass real content or nothing so
  // mail clients render the HTML version of the message.
  const info = await transporter.sendMail({
    from: email,
    to: sendTo,
    subject,
    ...(text ? { text } : {}),
    ...(html ? { html } : {}),
  });
  return info;
}
