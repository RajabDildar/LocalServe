import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);
const FROM = "onboarding@resend.dev";

const CLIENT_URL = env.CLIENT_URL;

const getHtmlTemplate = (
  title: string,
  previewText: string,
  actionUrl: string,
  buttonText: string,
  description: string,
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      
      <!-- Top Branding/Security Header -->
      <div style="background-color: #1e293b; padding: 24px; text-align: center;">
        <span style="font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">LocalServe</span>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 32px;">
        <h1 style="font-size: 22px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 12px;">${title}</h1>
        <p style="font-size: 15px; line-height: 24px; color: #475569; margin-bottom: 32px;">${description}</p>
        
        <!-- Action Button -->
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${actionUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 500; font-size: 15px; text-decoration: none; padding: 12px 32px; border-radius: 6px; transition: background-color 0.2s;">
            ${buttonText}
          </a>
        </div>

        <!-- Security Fallback Link -->
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 24px 0;" />
        <p style="font-size: 13px; line-height: 20px; color: #64748b; margin: 0;">
          If the button above does not work, copy and paste this URL into your browser:<br />
          <a href="${actionUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${actionUrl}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          This is an automated security transmission from LocalServe. If you did not request this email, please safely ignore it.
        </p>
      </div>

    </div>
  </body>
  </html>
`;

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${CLIENT_URL}/verify-email/${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your LocalServe account",
    html: getHtmlTemplate(
      "Verify your email address",
      "Verify your LocalServe account",
      verificationUrl,
      "Verify Account",
      "Thank you for joining LocalServe. To complete your setup and secure your account, please verify your email address by clicking the button below.",
    ),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your LocalServe password",
    html: getHtmlTemplate(
      "Reset your password",
      "Reset your LocalServe password",
      resetUrl,
      "Reset Password",
      "We received a request to reset your password for your LocalServe account. Click the button below to choose a new password. This link will expire shortly for your security.",
    ),
  });
};
