interface VerificationTemplateProps {
  firstName: string;
  url: string;
}

export function VerificationTemplate({ firstName, url }: VerificationTemplateProps) {
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
          PhotoTech DGMP
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
          Bonjour {firstName},
        </h2>
        
        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: '0 0 24px 0'
        }}>
          Bienvenue dans la plateforme sécurisée de gestion des archives photographiques et des missions de contrôle de chantier de la DGMP.
        </p>
        
        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: '0 0 32px 0'
        }}>
          Pour finaliser la création de votre compte et accéder à la photothèque sécurisée, veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail :
        </p>
        
        <div style={{
          textAlign: 'center' as const,
          margin: '32px 0'
        }}>
          <a href={url} style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            Vérifier mon e-mail
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
            paddingLeft: '16px'
          }}>
            <li>Gestion des rapports de mission</li>
            <li>Upload et organisation des photos</li>
            <li>Suivi des contrôles des marchés</li>
            <li>Extraction de contenus pour publications</li>
          </ul>
        </div>
        
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.4',
          margin: '24px 0 0 0'
        }}>
          Si vous n'avez pas demandé la création de ce compte, vous pouvez ignorer cet e-mail en toute sécurité.
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