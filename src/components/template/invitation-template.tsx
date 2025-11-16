interface InvitationTemplateProps {
  inviterName: string;
  organizationName: string;
  organizationLogo?: string | null;
  role: string;
  invitationUrl: string;
}

const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "u1":
      return "Agent de terrain";
    case "u2":
      return "Responsable missions";
    case "u3":
      return "Rédacteur magazine";
    case "u4":
      return "Administrateur système";
    case "u5":
      return "Gestionnaire organisation";
    default:
      return role;
  }
};

export function InvitationTemplate({
  inviterName,
  organizationName,
  organizationLogo,
  role,
  invitationUrl,
}: InvitationTemplateProps) {
  const roleDisplay = getRoleDisplayName(role);

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
          Invitation à rejoindre une organisation
        </h2>
        
        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: '0 0 24px 0'
        }}>
          <strong>{inviterName}</strong> vous invite à rejoindre l'organisation <strong>{organizationName}</strong> sur la plateforme MarketScan.
        </p>

        {organizationLogo && (
          <div style={{
            textAlign: 'center' as const,
            margin: '24px 0'
          }}>
            <img 
              src={organizationLogo} 
              alt={organizationName}
              style={{
                maxWidth: '120px',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
          </div>
        )}
        
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
            margin: '0 0 12px 0'
          }}>
            📋 Détails de l'invitation
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px'
          }}>
            <span style={{
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Rôle assigné:
            </span>
            <span style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {roleDisplay}
            </span>
          </div>
        </div>
        
        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: '0 0 32px 0'
        }}>
          Cliquez sur le bouton ci-dessous pour accepter l'invitation et rejoindre l'organisation :
        </p>
        
        <div style={{
          textAlign: 'center' as const,
          margin: '32px 0'
        }}>
          <a href={invitationUrl} style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            Accepter l'invitation
          </a>
        </div>
        
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          padding: '16px',
          marginTop: '32px'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '13px',
            lineHeight: '1.5',
            margin: '0'
          }}>
            <strong>Note :</strong> Cette invitation expirera dans 48 heures. Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet e-mail en toute sécurité.
          </p>
        </div>

        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: '0'
          }}>
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
          </p>
          <p style={{
            color: '#3b82f6',
            fontSize: '13px',
            wordBreak: 'break-all' as const,
            margin: '8px 0 0 0'
          }}>
            {invitationUrl}
          </p>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center' as const
      }}>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          margin: '0 0 8px 0'
        }}>
          © {new Date().getFullYear()} DGMP Gabon. Tous droits réservés.
        </p>
        <p style={{
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0'
        }}>
          Photothèque sécurisée - Direction Générale des Marchés Publics
        </p>
      </div>
    </div>
  );
}

