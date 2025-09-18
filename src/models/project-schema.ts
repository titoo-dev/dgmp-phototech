import { z } from 'zod';
import { CompanySchema } from './company-schema';

export const ProjectSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(1, "Le titre du marché est obligatoire").max(255),
    startDate: z.coerce.date({ message: "La date de début est obligatoire" }),
    endDate: z.coerce.date({ message: "La date de fin est obligatoire" }),
    company: CompanySchema,
    companyId: z.string().cuid(),
    description: z.string().min(1, "La description est obligatoire"),
    nature: z.enum(['SUPPLY', 'SERVICES', 'INTELLECTUAL', 'PROGRAM', 'MIXED', 'CONTROLLED_EXPENSES'], {
        message: "La nature du marché est obligatoire"
    }),
    status: z.enum(['UNCONTROLLED', 'CONTROLLED_IN_PROGRESS', 'CONTROLLED_DELIVERED', 'CONTROLLED_OTHER', 'DISPUTED'], {
        message: "Le statut du marché est obligatoire"
    })
}).refine(
    (data) => data.endDate > data.startDate,
    {
        message: "La date de fin doit être postérieure à la date de début",
        path: ["endDate"]
    }
);

// Schema for creating a new marché (without id)
export const CreateProjectSchema = ProjectSchema.omit({
    id: true
}).extend({
    companyId: z.string().cuid({ message: "L'ID de l'entreprise est obligatoire" })
}).omit({
    company: true
});

// Schema for updating a marché (all fields optional except id)
export const UpdateProjectSchema = ProjectSchema.partial().required({ id: true }).extend({
    companyId: z.string().cuid().optional()
}).omit({
    company: true
});

// Schema for updating a marché via form data
export const UpdateProjectFormSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(1, "Le titre du marché est obligatoire").max(255).optional(),
    description: z.string().min(1, "La description est obligatoire").optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    companyId: z.string().cuid().optional(),
    nature: z.enum(['SUPPLY', 'SERVICES', 'INTELLECTUAL', 'PROGRAM', 'MIXED', 'CONTROLLED_EXPENSES']).optional(),
    status: z.enum(['UNCONTROLLED', 'CONTROLLED_IN_PROGRESS', 'CONTROLLED_DELIVERED', 'CONTROLLED_OTHER', 'DISPUTED']).optional(),
}).refine(
    (data) => !data.endDate || !data.startDate || data.endDate > data.startDate,
    {
        message: "La date de fin doit être postérieure à la date de début",
        path: ["endDate"]
    }
);

// Type inference from schemas
export type ProjectModel = z.infer<typeof ProjectSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type UpdateProjectForm = z.infer<typeof UpdateProjectFormSchema>;