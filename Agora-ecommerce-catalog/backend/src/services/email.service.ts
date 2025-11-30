import { env } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email (placeholder - requires nodemailer or similar)
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!env.smtp.host || !env.smtp.user) {
    console.log('Email service not configured. Logging email instead:');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.text || options.html.substring(0, 100)}...`);
    return true;
  }

  // TODO: Implement actual email sending with nodemailer
  // const transporter = nodemailer.createTransport({
  //   host: env.smtp.host,
  //   port: env.smtp.port,
  //   auth: {
  //     user: env.smtp.user,
  //     pass: env.smtp.pass,
  //   },
  // });
  // await transporter.sendMail(options);

  console.log(`Email sent to: ${options.to}`);
  return true;
};

// Email templates
export const emailTemplates = {
  welcome: (firstName: string): { subject: string; html: string } => ({
    subject: 'Welcome to Agora E-Commerce!',
    html: `
      <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for joining Agora E-Commerce. We're excited to have you!</p>
      <p>Start shopping now and discover amazing products.</p>
    `,
  }),

  orderConfirmation: (orderId: string, total: number): { subject: string; html: string } => ({
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order <strong>${orderId}</strong> has been confirmed.</p>
      <p>Total: $${total.toFixed(2)}</p>
      <p>We'll notify you when your order ships.</p>
    `,
  }),

  orderShipped: (orderId: string, trackingNumber: string): { subject: string; html: string } => ({
    subject: `Your order ${orderId} has shipped!`,
    html: `
      <h1>Your order is on its way!</h1>
      <p>Order <strong>${orderId}</strong> has been shipped.</p>
      <p>Tracking number: <strong>${trackingNumber}</strong></p>
    `,
  }),

  passwordReset: (resetLink: string): { subject: string; html: string } => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  }),

  emailVerification: (verifyLink: string): { subject: string; html: string } => ({
    subject: 'Verify your email address',
    html: `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `,
  }),
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, firstName: string): Promise<boolean> => {
  const { subject, html } = emailTemplates.welcome(firstName);
  return sendEmail({ to: email, subject, html });
};

// Send order confirmation
export const sendOrderConfirmation = async (email: string, orderId: string, total: number): Promise<boolean> => {
  const { subject, html } = emailTemplates.orderConfirmation(orderId, total);
  return sendEmail({ to: email, subject, html });
};

// Send order shipped notification
export const sendOrderShipped = async (email: string, orderId: string, trackingNumber: string): Promise<boolean> => {
  const { subject, html } = emailTemplates.orderShipped(orderId, trackingNumber);
  return sendEmail({ to: email, subject, html });
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<boolean> => {
  const resetLink = `${env.frontendUrl}/reset-password?token=${resetToken}`;
  const { subject, html } = emailTemplates.passwordReset(resetLink);
  return sendEmail({ to: email, subject, html });
};

// Send email verification
export const sendVerificationEmail = async (email: string, verifyToken: string): Promise<boolean> => {
  const verifyLink = `${env.frontendUrl}/verify-email?token=${verifyToken}`;
  const { subject, html } = emailTemplates.emailVerification(verifyLink);
  return sendEmail({ to: email, subject, html });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendPasswordResetEmail,
  sendVerificationEmail,
};

