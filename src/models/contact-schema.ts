import { z } from 'zod';

export const ContactSchema = z.object({
  id: z.string().cuid(),
  firstName: z.string().min(1, "Le prénom est obligatoire").max(100),
  lastName: z.string().min(1, "Le nom est obligatoire").max(100),
  email: z.string().email("Adresse email invalide"),
});

// Schema for creating a new contact (without id)
export const CreateContactSchema = ContactSchema.omit({
  id: true
});

// Schema for updating a contact (all fields optional except id)
export const UpdateContactSchema = ContactSchema.partial().required({ id: true });

// Type inference from schemas
export type ContactModel = z.infer<typeof ContactSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type CreateContact = z.infer<typeof CreateContactSchema>;
export type UpdateContact = z.infer<typeof UpdateContactSchema>;