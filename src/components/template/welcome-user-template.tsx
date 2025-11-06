interface WelcomeUserTemplateProps {
  firstName: string;
  email: string;
  password: string;
  androidAppUrl?: string;
}

export function WelcomeUserTemplate({
  firstName,
  email,
  password,
  androidAppUrl = "#"
}: WelcomeUserTemplateProps) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        padding: '32px 24px',
        textAlign: 'center' as const
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>
          MarketScan DGMP
        </h1>
        <p style={{
          color: '#9ca3af',
          fontSize: '16px',
          margin: '0'
        }}>
          Direction Générale des Marchés Publics du Gabon
        </p>
      </div>

      <div style={{
        padding: '32px 24px'
      }}>
        <h2 style={{
          color: '#111827',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 16px 0'
        }}>
          Bienvenue {firstName} !
        </h2>

        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: '0 0 24px 0'
        }}>
          Un compte a été créé pour vous sur la plateforme MarketScan de gestion des missions de contrôle et archives photographiques de la DGMP.
        </p>

        <div style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '20px',
          margin: '24px 0'
        }}>
          <h3 style={{
            color: '#1e40af',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0'
          }}>
            🔐 Vos identifiants de connexion
          </h3>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '12px'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              textTransform: 'uppercase' as const
            }}>
              Adresse e-mail
            </p>
            <p style={{
              color: '#111827',
              fontSize: '16px',
              fontWeight: '600',
              margin: '0',
              wordBreak: 'break-all' as const
            }}>
              {email}
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '6px'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              textTransform: 'uppercase' as const
            }}>
              Mot de passe
            </p>
            <p style={{
              color: '#111827',
              fontSize: '16px',
              fontWeight: '600',
              margin: '0',
              fontFamily: 'monospace'
            }}>
              {password}
            </p>
          </div>

          <p style={{
            color: '#1e40af',
            fontSize: '13px',
            margin: '16px 0 0 0',
            lineHeight: '1.4'
          }}>
            ⚠️ Pour votre sécurité, nous vous recommandons de modifier votre mot de passe lors de votre première connexion.
          </p>
        </div>

        <div style={{
          textAlign: 'center' as const,
          margin: '32px 0'
        }}>
          <a href={`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`} style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            Se connecter à la plateforme
          </a>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          padding: '16px',
          margin: '24px 0'
        }}>
          <h3 style={{
            color: '#166534',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center'
          }}>
            📱 Application Mobile Android
          </h3>
          <p style={{
            color: '#166534',
            fontSize: '14px',
            lineHeight: '1.4',
            margin: '0 0 12px 0'
          }}>
            Téléchargez l'application Android pour capturer des photos directement depuis le terrain lors de vos missions de contrôle.
          </p>
          <a href={androidAppUrl} style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            Télécharger l'app Android
          </a>
        </div>

        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          padding: '16px',
          margin: '24px 0'
        }}>
          <h3 style={{
            color: '#374151',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            Accès à la plateforme :
          </h3>
          <ul style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: '0',
            paddingLeft: '16px',
            lineHeight: '1.6'
          }}>
            <li>Créer et gérer vos rapports de mission</li>
            <li>Uploader et organiser vos photos de chantier</li>
            <li>Suivre les contrôles des marchés publics</li>
            <li>Collaborer avec votre équipe</li>
          </ul>
        </div>

        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.4',
          margin: '24px 0 0 0'
        }}>
          Si vous avez des questions ou besoin d'assistance, contactez votre administrateur système.
        </p>
      </div>

      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center' as const
      }}>
        <p style={{
          color: '#6b7280',
          fontSize: '12px',
          margin: '0 0 8px 0'
        }}>
          Direction Générale des Marchés Publics du Gabon
        </p>
        <p style={{
          color: '#6b7280',
          fontSize: '12px',
          margin: '0'
        }}>
          Plateforme sécurisée de gestion des archives photographiques
        </p>
      </div>
    </div>
  );
}
