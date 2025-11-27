export type Organization = {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
  members: Array<{
    id: string;
    role: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      role: string | null;
      image: string | null;
    };
  }>;
  _count: {
    members: number;
  };
};

export type Invitation = {
  id: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Date;
  organizationId: string;
  inviterId: string;
  inviter: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export type EditOrganizationClientProps = {
  organization: Organization;
  initialInvitations: Invitation[];
};

export type Role = "u1" | "u2" | "u3" | "u4" | "u5";

export type SlugValidation = {
  isValid: boolean;
  message?: string;
};