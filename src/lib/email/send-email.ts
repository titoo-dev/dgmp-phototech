/**
 * Email service using Brevo API (formerly Sendinblue)
 * 
 * Required environment variables:
 * - BREVO_API_KEY: Your Brevo API key
 * - BREVO_FROM_EMAIL: Default sender email address (optional, defaults to noreply@titosy.dev)
 * - BREVO_FROM_NAME: Default sender name (optional, defaults to DGMP Photothèque)
 * - NEXT_PUBLIC_APP_URL: Application URL for links
 */

import { z } from "zod";
import {
  verificationTemplate,
  invitationTemplate,
  welcomeTemplate,
} from "./templates";

const emailAddressSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().optional(),
});

const sendEmailSchema = z.object({
  to: z.array(emailAddressSchema).min(1, "At least one recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  htmlContent: z.string().min(1, "HTML content is required"),
  textContent: z.string().optional(),
  replyTo: emailAddressSchema.optional(),
  cc: z.array(emailAddressSchema).optional(),
  bcc: z.array(emailAddressSchema).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type EmailAddress = z.infer<typeof emailAddressSchema>;
export type SendEmailParams = z.infer<typeof sendEmailSchema>;

interface BrevoResponse {
  messageId: string;
}

interface BrevoError {
  code: string;
  message: string;
}

const loadTemplate = (template: string, context: Record<string, any>): string => {
  let htmlContent = template;
  
  Object.keys(context).forEach(key => {
    const placeholder = `{{${key}}}`;
    const value = context[key] || '';
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return htmlContent;
};

/**
 * Send an email using Brevo API
 */
export const sendEmailByApi = async ({
  to,
  subject,
  template,
  context,
}: {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}): Promise<BrevoResponse> => {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const htmlContent = loadTemplate(template, context);

  const payload = {
    sender: { 
      email: process.env.BREVO_FROM_EMAIL || 'noreply@titosy.dev', 
      name: process.env.BREVO_FROM_NAME || 'DGMP Photothèque' 
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json() as BrevoError;
      throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json() as BrevoResponse;
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Send a verification email
 */
export const sendVerificationEmail = async (
  email: string,
  verificationLink: string,
  userName?: string
): Promise<BrevoResponse> => {
  const template = verificationTemplate(verificationLink, userName);
  
  return sendEmailByApi({
    to: email,
    subject: template.subject,
    template: template.htmlContent,
    context: {
      verificationLink,
      userName: userName || "",
    },
  });
};

/**
 * Send an invitation email
 */
export const sendInvitationEmail = async (
  email: string,
  invitationUrl: string,
  inviterName: string,
  organizationName: string,
  role: string,
  organizationLogo?: string | null
): Promise<BrevoResponse> => {
  const template = invitationTemplate(
    invitationUrl,
    inviterName,
    organizationName,
    role,
    organizationLogo
  );
  
  return sendEmailByApi({
    to: email,
    subject: template.subject,
    template: template.htmlContent,
    context: {
      invitationUrl,
      inviterName,
      organizationName,
      role,
      organizationLogo: organizationLogo || "",
    },
  });
};

/**
 * Send a welcome email
 */
export const sendWelcomeEmail = async (
  email: string,
  userName: string,
  organizationName?: string
): Promise<BrevoResponse> => {
  const template = welcomeTemplate(userName, organizationName);
  
  return sendEmailByApi({
    to: email,
    subject: template.subject,
    template: template.htmlContent,
    context: {
      userName,
      organizationName: organizationName || "",
    },
  });
};
