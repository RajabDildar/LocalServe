import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);
const FROM = "onboarding@resend.dev";

// TODO: once frontend auth pages exist, point these at CLIENT_URL pages
// (e.g. /verify-email/:token) that call the API and show a proper UI,
// instead of hitting the backend directly.
const BACKEND_URL = `http://localhost:${env.PORT}`;

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your LocalServe account",
    html: `<p>Click <a href="${BACKEND_URL}/api/auth/verify-email/${token}">here</a> to verify your account.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your LocalServe password",
    html: `<p>Click <a href="${BACKEND_URL}/api/auth/reset-password/${token}">here</a> to reset your password.</p>`,
  });
};
