import { z } from 'zod';

// Schema matching the actual Prisma User model
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email("Adresse email invalide"),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.string().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.date().nullable(),
});

// Schema for creating a new user (without auto-generated fields)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Schema for updating a user (all fields optional except id)
export const UpdateUserSchema = UserSchema.partial().required({ id: true });

// Public user schema (safe for client-side use)
export const PublicUserSchema = UserSchema.omit({ 
  banned: true,
  banReason: true,
  banExpires: true
});

// Type inference from schemas
export type UserModel = z.infer<typeof UserSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
