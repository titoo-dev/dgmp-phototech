/**
 * Invitation Email Template
 * Sent when users are invited to join an organization
 */

import type { EmailTemplateContent } from "../types";

const getRoleDisplayName = (role: string): string => {
  switch (role.toLowerCase()) {
    case "u1":
      return "Agent terrain";
    case "u2":
      return "Responsable";
    case "u3":
      return "Rédacteur";
    case "u4":
      return "Administrateur";
    case "u5":
      return "Super Administrateur";
    default:
      return role;
  }
};

export const invitationTemplate = (
  invitationUrl: string,
  inviterName: string,
  organizationName: string,
  role: string,
  organizationLogo?: string | null
): EmailTemplateContent => {
  const displayRole = getRoleDisplayName(role);
  
  return {
  subject: `Invitation à rejoindre ${organizationName} - DGMP Photothèque`,
  htmlContent: `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation à rejoindre ${organizationName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .org-logo { max-width: 80px; height: auto; margin-bottom: 15px; border-radius: 8px; background: white; padding: 10px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.8; }
          .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; padding: 20px; margin: 20px 0; }
          .info-box p { margin: 10px 0; font-size: 14px; color: #666; }
          .info-box strong { color: #333; }
          .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .link-info { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; }
          .link-info p { margin: 0; font-size: 14px; color: #666; }
          .link-info a { color: #667eea; word-break: break-all; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 14px; color: #6c757d; }
          .footer a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${organizationLogo ? `<img src="${organizationLogo}" alt="${organizationName}" class="org-logo" />` : ''}
            <h1>🎉 Invitation</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">DGMP Photothèque</p>
          </div>
          <div class="content">
            <p class="greeting">Bonjour !</p>
            <p class="message">
              <strong>${inviterName}</strong> vous invite à rejoindre l'organisation <strong>${organizationName}</strong> sur la plateforme DGMP Photothèque.
            </p>
            <div class="info-box">
              <p><strong>Organisation :</strong> ${organizationName}</p>
              <p><strong>Rôle attribué :</strong> ${displayRole}</p>
              <p><strong>Invité par :</strong> ${inviterName}</p>
            </div>
            <p class="message">
              En acceptant cette invitation, vous pourrez accéder aux projets de l'organisation, collaborer avec l'équipe et gérer les rapports de mission selon votre rôle.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${invitationUrl}" class="cta-button">Accepter l'invitation</a>
            </div>
            <div class="link-info">
              <p><strong>Le lien ne fonctionne pas ?</strong></p>
              <p>Copiez et collez cette URL dans votre navigateur :</p>
              <p><a href="${invitationUrl}">${invitationUrl}</a></p>
            </div>
            <p class="message" style="margin-top: 30px; font-size: 14px;">
              <strong>Note :</strong> Cette invitation est valable pendant 7 jours. Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email en toute sécurité.
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
Invitation à rejoindre ${organizationName}

Bonjour !

${inviterName} vous invite à rejoindre l'organisation ${organizationName} sur la plateforme DGMP Photothèque.

Organisation : ${organizationName}
Rôle attribué : ${displayRole}
Invité par : ${inviterName}

En acceptant cette invitation, vous pourrez accéder aux projets de l'organisation, collaborer avec l'équipe et gérer les rapports de mission selon votre rôle.

Pour accepter l'invitation, cliquez sur le lien suivant :
${invitationUrl}

Cette invitation est valable pendant 7 jours.

Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.

Direction Générale des Marchés Publics - Gabon
Visitez notre plateforme : ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}

© 2025 DGMP Photothèque. Tous droits réservés.
  `,
  };
};

