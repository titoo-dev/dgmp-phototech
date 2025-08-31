import { z } from 'zod';

export const CompanySchema = z.object({
	id: z.string().cuid(),
	name: z.string().min(1, "Le nom de l'entreprise est obligatoire").max(255),
	email: z.string().email('Adresse email invalide'),
	phoneNumber: z.string().min(1, 'Le numéro de téléphone est obligatoire'),
	nif: z.string().min(1, 'Le NIF est obligatoire'),
	employeeCount: z
		.number()
		.int()
		.min(0, "L'effectif ne peut pas être négatif"),
	projectsCount: z
		.number()
		.int()
		.min(0, 'Le nombre de projets ne peut pas être négatif'),
});

// Schema for creating a new company (without id and counts)
export const CreateCompanySchema = CompanySchema.omit({
	id: true,
	projectsCount: true,
}).extend({
	employeeCount: z
		.number()
		.int()
		.min(1, "L'effectif doit être d'au moins 1 employé"),
});

// Schema for updating a company (all fields optional except id)
export const UpdateCompanySchema = CompanySchema.partial().required({
	id: true,
});

// Schema for updating a company via form data (companyId as string)
export const UpdateCompanyFormSchema = z.object({
	id: z.string().cuid(),
	name: z.string().min(1, "Le nom de l'entreprise est obligatoire").max(255).optional(),
	email: z.string().email('Adresse email invalide').optional(),
	phoneNumber: z.string().min(1, 'Le numéro de téléphone est obligatoire').optional(),
	nif: z.string().min(1, 'Le NIF est obligatoire').optional(),
	employeeCount: z
		.number()
		.int()
		.min(0, "L'effectif ne peut pas être négatif")
		.optional(),
});

// Type inference from schemas
export type CompanyModel = z.infer<typeof CompanySchema>;
export type Company = z.infer<typeof CompanySchema>;
export type CreateCompany = z.infer<typeof CreateCompanySchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;
export type UpdateCompanyForm = z.infer<typeof UpdateCompanyFormSchema>;
