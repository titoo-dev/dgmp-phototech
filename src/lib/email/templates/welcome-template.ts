/**
 * Welcome Email Template
 * Sent when users successfully verify their email and join
 */

import type { EmailTemplateContent } from "../types";

export const welcomeTemplate = (
  userName: string,
  organizationName?: string
): EmailTemplateContent => ({
  subject: "Bienvenue sur DGMP Photothèque",
  htmlContent: `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.8; }
          .features { background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0; }
          .feature-item { display: flex; align-items: start; margin-bottom: 20px; }
          .feature-item:last-child { margin-bottom: 0; }
          .feature-icon { font-size: 24px; margin-right: 15px; }
          .feature-text h3 { margin: 0 0 5px 0; font-size: 16px; color: #333; }
          .feature-text p { margin: 0; font-size: 14px; color: #666; }
          .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 14px; color: #6c757d; }
          .footer a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bienvenue !</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">DGMP Photothèque</p>
          </div>
          <div class="content">
            <p class="greeting">Bonjour ${userName} !</p>
            <p class="message">
              Bienvenue sur la plateforme DGMP Photothèque${organizationName ? ` au sein de l'organisation <strong>${organizationName}</strong>` : ''}. 
              Votre compte a été activé avec succès et vous pouvez maintenant profiter de toutes les fonctionnalités de la plateforme.
            </p>
            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">📸</div>
                <div class="feature-text">
                  <h3>Gestion des photos</h3>
                  <p>Centralisez vos archives photographiques des missions de contrôle de chantier</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <div class="feature-text">
                  <h3>Rapports de mission</h3>
                  <p>Créez, modifiez et suivez vos rapports de mission en temps réel</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🗺️</div>
                <div class="feature-text">
                  <h3>Vue cartographique</h3>
                  <p>Visualisez vos projets sur une carte interactive</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">👥</div>
                <div class="feature-text">
                  <h3>Collaboration</h3>
                  <p>Travaillez en équipe sur les projets et partagez vos observations</p>
                </div>
              </div>
            </div>
            <p class="message">
              Nous vous recommandons de commencer par explorer vos projets et de vous familiariser avec l'interface.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="cta-button">Accéder au tableau de bord</a>
            </div>
            <p class="message" style="margin-top: 30px; font-size: 14px;">
              Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter votre administrateur ou notre équipe de support.
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
Bienvenue sur DGMP Photothèque

Bonjour ${userName} !

Bienvenue sur la plateforme DGMP Photothèque${organizationName ? ` au sein de l'organisation ${organizationName}` : ''}. 
Votre compte a été activé avec succès.

Fonctionnalités disponibles :

📸 Gestion des photos
Centralisez vos archives photographiques des missions de contrôle de chantier

📝 Rapports de mission
Créez, modifiez et suivez vos rapports de mission en temps réel

🗺️ Vue cartographique
Visualisez vos projets sur une carte interactive

👥 Collaboration
Travaillez en équipe sur les projets et partagez vos observations

Accédez à votre tableau de bord : ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard

Si vous avez des questions, contactez votre administrateur.

Direction Générale des Marchés Publics - Gabon
© 2025 DGMP Photothèque. Tous droits réservés.
  `,
});

