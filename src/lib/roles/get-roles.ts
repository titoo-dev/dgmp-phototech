"use server";

const AVAILABLE_ROLES = [
  "U1", // Utilisateur chargé d'exécuter les missions
  "U2", // Responsable ayant accès aux rapports de mission
  "U3", // Responsable de la rédaction du magazine
  "U4"  // Administrateur du système
] as const;

export type Role = typeof AVAILABLE_ROLES[number];

export const getRoles = (): Role[] => {
  return [...AVAILABLE_ROLES];
};

export const getRoleLabel = (role: Role): string => {
  const roleLabels: Record<Role, string> = {
    U1: "Utilisateur mission",
    U2: "Responsable rapports",
    U3: "Responsable rédaction",
    U4: "Administrateur"
  };
  
  return roleLabels[role];
};

export const isValidRole = (role: string): role is Role => {
  return AVAILABLE_ROLES.includes(role as Role);
};
