"use server";

const AVAILABLE_ROLES = [
  "U1", // Agent terrain - Utilisateur chargé d'exécuter les missions
  "U2", // Responsable - Responsable ayant accès aux rapports de mission
  "U3", // Rédacteur - Responsable de la rédaction du magazine
  "U4", // Administrateur - Administrateur du système
  "U5"  // Super Administrateur - Gestion des organisations
] as const;

export type Role = typeof AVAILABLE_ROLES[number];

export const getRoles = (): Role[] => {
  return [...AVAILABLE_ROLES];
};

export const getRoleLabel = (role: Role): string => {
  const roleLabels: Record<Role, string> = {
    U1: "Agent terrain",
    U2: "Responsable",
    U3: "Rédacteur",
    U4: "Administrateur",
    U5: "Super Administrateur"
  };

  return roleLabels[role];
};

export const isValidRole = (role: string): role is Role => {
  return AVAILABLE_ROLES.includes(role as Role);
};
