/**
 * Verification Email Template
 * Sent when users sign up to verify their email address
 */

import type { EmailTemplateContent } from "../types";

export const verificationTemplate = (
  verificationLink: string,
  userName?: string
): EmailTemplateContent => ({
  subject: "Vérifiez votre adresse email - DGMP Photothèque",
  htmlContent: `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification Email</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.8; }
          .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .link-info { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; }
          .link-info p { margin: 0; font-size: 14px; color: #666; }
          .link-info a { color: #667eea; word-break: break-all; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 14px; color: #6c757d; }
          .footer a { color: #667eea; text-decoration: none; }
          .logo { width: 120px; height: auto; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Vérification Email</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">DGMP Photothèque</p>
          </div>
          <div class="content">
            <p class="greeting">Bonjour ${userName || ""}!</p>
            <p class="message">
              Merci de vous être inscrit sur la plateforme DGMP Photothèque. Pour activer votre compte et commencer à gérer vos missions, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationLink}" class="cta-button">Vérifier mon email</a>
            </div>
            <div class="link-info">
              <p><strong>Le lien ne fonctionne pas ?</strong></p>
              <p>Copiez et collez cette URL dans votre navigateur :</p>
              <p><a href="${verificationLink}">${verificationLink}</a></p>
            </div>
            <p class="message" style="margin-top: 30px; font-size: 14px;">
              <strong>Note :</strong> Ce lien est valable pendant 24 heures. Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.
            </p>
          </div>
          <div class="footer">
            <p>Direction Générale des Marchés Publics - Gabon</p>
            <p style="margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" style="color: #667eea; font-weight: 600;">Visiter la plateforme</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              © 2025 DGMP Photothèque. Tous droits réservés.
            </p>
          </div>
        </div>
      </body>
    </html>
  `,
  textContent: `
Vérifiez votre adresse email

Bonjour ${userName || ""}!

Merci de vous être inscrit sur la plateforme DGMP Photothèque. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le lien suivant :

${verificationLink}

Ce lien est valable pendant 24 heures.

Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.

Direction Générale des Marchés Publics - Gabon
Visitez notre plateforme : ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}

© 2025 DGMP Photothèque. Tous droits réservés.
  `,
});

