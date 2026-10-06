import nodemailer from "nodemailer";
import { config } from "../config/env.js";

let transporter; // created on first use

const getTransporter = () => {
  transporter ??= config.isTest
    ? nodemailer.createTransport({ jsonTransport: true }) // tests never touch the network
    : nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        requireTLS: config.isProduction, // never send credentials in clear text in production
        auth: { user: config.smtp.user, pass: config.smtp.pass },
        // without these a dead SMTP host keeps sockets open for minutes
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });
  return transporter;
};

// Keep full addresses out of the logs
const maskEmail = (email) => {
  const [local = "", domain = ""] = String(email).split("@");
  return `${local.slice(0, 1)}***@${domain}`;
};

/**
 * Sends one email. Never throws: a failed email must not break the action that triggered it.
 * Resolves true if the SMTP server accepted the message, false otherwise (and logs why).
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await getTransporter().sendMail({ from: config.smtp.from, to, subject, html });
    return true;
  } catch (err) {
    console.error(`Email to ${maskEmail(to)} failed: ${err.message}`);
    return false;
  }
};

/**
 * Fire-and-forget helper for callers that must not wait:
 *   void sendTemplateEmail(user.email, () => welcomeEmail(user));
 * Never throws, even if building the template fails.
 */
export const sendTemplateEmail = (to, buildTemplate) => {
  try {
    return sendEmail({ to, ...buildTemplate() });
  } catch (err) {
    console.error(`Email template failed: ${err.message}`);
    return Promise.resolve(false);
  }
};