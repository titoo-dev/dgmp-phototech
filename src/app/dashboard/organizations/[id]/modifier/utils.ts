import type { Role, SlugValidation } from "./types";

export const getRoleBadgeVariant = (role: string | null) => {
  switch (role) {
    case "u4":
    case "u5":
      return "default";
    case "u2":
    case "u3":
      return "secondary";
    case "u1":
      return "outline";
    default:
      return "outline";
  }
};

export const getRoleDisplayName = (role: string | null): string => {
  if (!role) return "Agent de terrain";

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

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const validateSlugFormat = (slug: string): SlugValidation => {
  if (!slug) return { isValid: false };
  if (slug.length < 2) return { isValid: false, message: "Minimum 2 caractères" };
  if (slug.length > 50) return { isValid: false, message: "Maximum 50 caractères" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { isValid: false, message: "Lettres minuscules, chiffres et tirets uniquement" };
  }
  return { isValid: true };
};