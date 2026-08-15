import resend from "../config/resend.js";

interface SendPasswordResetEmailParams {
  email: string;
  name: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> => {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: [email],
    subject: "Reset your password",
    html: `
      <div>
        <h1>Password Reset</h1>

        <p>Hi ${name},</p>

        <p>
          We received a request to reset your Chroma Garcia account password.
        </p>

        <p>
          Click the link below to reset your password:
        </p>

        <p>
          <a href="${resetUrl}">
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in 1 hour.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);

    throw new Error("Failed to send password reset email.");
  }
};
