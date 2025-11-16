import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  slug: z
    .string()
    .min(2, "Le slug doit contenir au moins 2 caractères")
    .max(50, "Le slug ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets"
    )
    .optional(),
  logo: z.string().url("L'URL du logo doit être valide").optional().or(z.literal("")),
});

export const updateOrganizationSchema = z.object({
  id: z.string().min(1, "L'ID de l'organisation est requis"),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .optional(),
  slug: z
    .string()
    .min(2, "Le slug doit contenir au moins 2 caractères")
    .max(50, "Le slug ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets"
    )
    .optional(),
  logo: z.string().url("L'URL du logo doit être valide").optional().or(z.literal("")),
});

export const deleteOrganizationSchema = z.object({
  id: z.string().min(1, "L'ID de l'organisation est requis"),
});

export const addAdminToOrganizationSchema = z.object({
  organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
  userId: z.string().min(1, "L'ID de l'utilisateur est requis"),
});

export const removeAdminFromOrganizationSchema = z.object({
  organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
  memberId: z.string().min(1, "L'ID du membre est requis"),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;
export type AddAdminToOrganizationInput = z.infer<typeof addAdminToOrganizationSchema>;
export type RemoveAdminFromOrganizationInput = z.infer<typeof removeAdminFromOrganizationSchema>;
