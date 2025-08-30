import { APIError } from "better-auth/api";

export const getAuthErrorMessage = (error: unknown, context?: 'signin' | 'signup'): string => {
    if (error instanceof APIError) {
      // Check for specific error codes in the message
      const errorMessage = error.message?.toLowerCase() || '';
      
      // Handle specific Better Auth error codes
      if (errorMessage.includes('user_already_exists') || errorMessage.includes('email already exists')) {
        return "An account with this email already exists. Please sign in instead.";
      }
      
      if (errorMessage.includes('invalid_credentials') || errorMessage.includes('invalid email or password')) {
        return "Invalid email or password. Please check your credentials and try again.";
      }
      
      if (errorMessage.includes('email_not_verified')) {
        return "Please verify your email address. Check your inbox for the verification link.";
      }
      
      if (errorMessage.includes('password_compromised')) {
        return "This password has been found in data breaches. Please choose a different password.";
      }
      
      // Handle by status code
      switch (error.status) {
        case 400:
          if (context === 'signup') {
            return "Invalid registration data. Please check your information and try again.";
          }
          return "Invalid email or password format. Please check your input.";
        case 401:
          return "Invalid email or password. Please check your credentials and try again.";
        case 403:
          if (context === 'signup') {
            return "Registration is not allowed. Please contact support.";
          }
          return "Email not verified. Please check your inbox and verify your email address.";
        case 404:
          if (context === 'signup') {
            return "Registration service unavailable. Please try again later.";
          }
          return "Account not found. Please check your email address or sign up for a new account.";
        case 409:
          return "An account with this email already exists. Please sign in instead.";
        case 422:
          return "Please check your input - some fields contain invalid data.";
        case 429:
          if (context === 'signup') {
            return "Too many registration attempts. Please wait a moment before trying again.";
          }
          return "Too many sign-in attempts. Please wait a moment before trying again.";
        case 500:
          return "Server error. Please try again later.";
        case 503:
          return "Service temporarily unavailable. Please try again in a few minutes.";
        default:
          return error.message || "Authentication failed. Please try again.";
      }
    }
  
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return "Network error. Please check your internet connection and try again.";
      }
      
      if (errorMessage.includes('timeout')) {
        return "Request timed out. Please try again.";
      }
      
      return error.message;
    }
  
    return "An unexpected error occurred. Please try again.";
  };