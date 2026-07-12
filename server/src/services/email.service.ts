import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);
const FROM = 'LocalServe <noreply@localserve.app>';

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your LocalServe account',
    html: `<p>Click <a href="${env.CLIENT_URL}/verify-email/${token}">here</a> to verify your account.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your LocalServe password',
    html: `<p>Click <a href="${env.CLIENT_URL}/reset-password/${token}">here</a> to reset your password.</p>`,
  });
};
