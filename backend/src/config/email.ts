import nodemailer from 'nodemailer';
import { env } from './env';

function createTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('⚠️  SMTP not configured — emails will not be sent');
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

const transporter = createTransporter();

export async function sendApprovalEmail(to: string, name: string): Promise<void> {
  if (!transporter) return;
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: '✅ Account Approved — PM System',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Great news — your account has been <strong>approved</strong>.</p>
      <p>You can now log in at <a href="${env.FRONTEND_URL}">${env.FRONTEND_URL}</a>.</p>
    `,
  });
}

export async function sendRejectionEmail(to: string, name: string): Promise<void> {
  if (!transporter) return;
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: '❌ Account Registration Update — PM System',
    html: `
      <h2>Hello, ${name}</h2>
      <p>Unfortunately, your registration request has been <strong>rejected</strong>.</p>
      <p>Please contact an administrator for more information.</p>
    `,
  });
}
