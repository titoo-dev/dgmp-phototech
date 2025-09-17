import { z } from 'zod';
import { ContactSchema } from './contact-schema';
import { PublicUserSchema } from './user-schema';

export const MissionSchema = z.object({
    id: z.string().cuid(),
    missionNumber: z.string().min(1, "Le numéro de mission est obligatoire"),
    teamLeader: PublicUserSchema,
    teamLeaderId: z.string(),
    members: z.array(ContactSchema),
    startDate: z.date({
        message: "La date de début est obligatoire"
    }),
    endDate: z.date({
        message: "La date de fin est obligatoire"
    }),
    location: z.string().min(1, "Le lieu est obligatoire").max(255),
    agentCount: z.number().int().min(0, "Le nombre d'agents ne peut pas être négatif"),
    marketCount: z.number().int().min(0, "Le nombre de marchés ne peut pas être négatif"),
    status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED'], {
        message: "Le statut est obligatoire"
    })
}).refine(
    (data) => data.endDate >= data.startDate,
    {
        message: "La date de fin doit être postérieure ou égale à la date de début",
        path: ["endDate"]
    }
);

// Schema for creating a new mission (without id and auto-generated fields)
export const CreateMissionSchema = MissionSchema
    .omit({ id: true, missionNumber: true, teamLeaderId: true, members: true, status: true, teamLeader: true })
    .extend({
        members: z.array(z.string()).optional().default([]),
    });

// Schema for updating a mission (all fields optional except id)
export const UpdateMissionSchema = MissionSchema.partial().required({ id: true });

// Schema for updating a mission via form data
export const UpdateMissionFormSchema = z.object({
    id: z.string().cuid(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    location: z.string().min(1, "Le lieu est obligatoire").max(255).optional(),
    agentCount: z.number().int().min(0, "Le nombre d'agents ne peut pas être négatif").optional(),
    marketCount: z.number().int().min(0, "Le nombre de marchés ne peut pas être négatif").optional(),
    members: z.array(z.string()).optional().default([]),
}).refine(
    (data) => !data.endDate || !data.startDate || data.endDate >= data.startDate,
    {
        message: "La date de fin doit être postérieure ou égale à la date de début",
        path: ["endDate"]
    }
);

// Type inference from schemas
export type MissionModel = z.infer<typeof MissionSchema>;
export type Mission = z.infer<typeof MissionSchema>;
export type CreateMission = z.infer<typeof CreateMissionSchema>;
export type UpdateMission = z.infer<typeof UpdateMissionSchema>;
export type UpdateMissionForm = z.infer<typeof UpdateMissionFormSchema>;