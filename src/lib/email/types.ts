/**
 * TypeScript type definitions for the email service
 * 
 * These types provide better IDE support and type safety
 * when working with the email service.
 */

/**
 * Represents an email address with optional name
 */
export interface EmailAddress {
  email: string;
  name?: string;
}

/**
 * Parameters for sending an email
 */
export interface SendEmailParams {
  /** Recipients (at least one required) */
  to: EmailAddress[];
  
  /** Email subject */
  subject: string;
  
  /** HTML content of the email */
  htmlContent: string;
  
  /** Plain text content (optional but recommended) */
  textContent?: string;
  
  /** Reply-to address */
  replyTo?: EmailAddress;
  
  /** CC recipients */
  cc?: EmailAddress[];
  
  /** BCC recipients */
  bcc?: EmailAddress[];
  
  /** Custom headers */
  headers?: Record<string, string>;
  
  /** Tags for tracking and analytics */
  tags?: string[];
}

/**
 * Response from Brevo API when sending an email
 */
export interface BrevoResponse {
  /** Unique message ID from Brevo */
  messageId: string;
}

/**
 * Error response from Brevo API
 */
export interface BrevoError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
}

/**
 * Available email template types
 */
export type EmailTemplate = 
  | "verification"
  | "welcome"
  | "password-reset"
  | "survey-confirmation"
  | "admin-notification";

/**
 * Survey information for admin notifications
 */
export interface SurveyNotificationInfo {
  /** Name of the survey participant */
  userName: string;
  
  /** Email of the survey participant */
  userEmail: string;
  
  /** City where the procedure is taking place */
  city: string;
  
  /** Type of land procedure */
  procedureType: string;
  
  /** Stage the user has reached in the process */
  stageReached: string;
  
  /** Optional dossier ID */
  dossierId?: string;
  
  /** Timestamp when the survey was submitted */
  submittedAt: Date;
}

/**
 * Result of an email send operation
 */
export interface EmailSendResult {
  /** Whether the email was sent successfully */
  success: boolean;
  
  /** Message ID if successful */
  messageId?: string;
  
  /** Error message if failed */
  error?: string;
  
  /** Error code if failed */
  code?: string;
}

/**
 * Email template content
 */
export interface EmailTemplateContent {
  /** Email subject */
  subject: string;
  
  /** HTML content */
  htmlContent: string;
  
  /** Plain text content */
  textContent: string;
}

/**
 * Configuration for the email service
 */
export interface EmailServiceConfig {
  /** Brevo API key */
  apiKey: string;
  
  /** Default sender email */
  fromEmail: string;
  
  /** Default sender name */
  fromName: string;
  
  /** Application URL for generating links */
  appUrl: string;
}

/**
 * Options for batch email sending
 */
export interface BatchEmailOptions {
  /** Delay between emails in milliseconds */
  delayMs?: number;
  
  /** Maximum number of emails to send */
  maxEmails?: number;
  
  /** Whether to stop on first error */
  stopOnError?: boolean;
}

/**
 * Result of a batch email send operation
 */
export interface BatchEmailResult {
  /** Individual results for each email */
  results: Array<{
    email: string;
    success: boolean;
    messageId?: string;
    error?: Error;
  }>;
  
  /** Number of successfully sent emails */
  successCount: number;
  
  /** Number of failed emails */
  failureCount: number;
}

/**
 * Email validation result
 */
export interface EmailValidationResult {
  /** Whether the email format is valid */
  isValid: boolean;
  
  /** Error message if invalid */
  error?: string;
}

/**
 * Email delivery status (from Brevo webhooks)
 */
export type EmailDeliveryStatus =
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "soft_bounced"
  | "hard_bounced"
  | "spam"
  | "blocked"
  | "unsubscribed"
  | "error";

/**
 * Webhook event from Brevo
 */
export interface BrevoWebhookEvent {
  /** Event type */
  event: EmailDeliveryStatus;
  
  /** Email address */
  email: string;
  
  /** Message ID */
  "message-id": string;
  
  /** Timestamp */
  date: string;
  
  /** Subject */
  subject: string;
  
  /** Tags */
  tags?: string[];
  
  /** Additional data */
  [key: string]: unknown;
}

