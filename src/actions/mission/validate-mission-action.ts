"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ValidateMissionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function validateMissionAction(
  missionId: string
): Promise<ValidateMissionState> {
  try {
    // Validate inputs
    if (!missionId || typeof missionId !== 'string') {
      return {
        errors: { _form: ['ID de mission invalide'] },
        success: false,
      };
    }

    // Check if mission exists and is in PENDING status
    const existingMission = await prisma.mission.findUnique({
      where: { id: missionId },
      select: { 
        id: true, 
        status: true, 
        missionNumber: true,
        location: true,
        startDate: true,
        endDate: true,
        teamLeader: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!existingMission) {
      return {
        errors: { _form: ['Mission introuvable'] },
        success: false,
      };
    }

    if (existingMission.status !== MissionStatus.PENDING) {
      return {
        errors: { _form: ['Seules les missions en attente peuvent être validées'] },
        success: false,
      };
    }

    // Update mission status to COMPLETED
    await prisma.mission.update({
      where: { id: missionId },
      data: { status: MissionStatus.COMPLETED },
    });

    // Send email notification to team leader
    try {
      await resend.batch.send([{
        from: 'MarketScan <noreply@titosy.dev>',
        to: [existingMission.teamLeader.email],
        subject: `Mission validée - Mission #${existingMission.missionNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
              Mission Validée ✅
            </h2>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #16a34a; margin-top: 0;">Mission #${existingMission.missionNumber}</h3>
              <p><strong>Chef d'équipe:</strong> ${existingMission.teamLeader.name}</p>
              <p><strong>Lieu:</strong> ${existingMission.location}</p>
              <p><strong>Période:</strong> Du ${new Date(existingMission.startDate).toLocaleDateString('fr-FR')} au ${new Date(existingMission.endDate).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <p>Félicitations ! Votre mission a été validée avec succès par l'équipe de validation.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/missions" 
                 style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Voir la mission
              </a>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 14px; text-align: center;">
              MarketScan - Système de gestion des missions
            </p>
          </div>
        `
      }]);
    } catch (emailError) {
      console.error('Error sending validation email:', emailError);
      // Don't fail the entire operation if email fails
    }

    // Revalidate the missions page to show updated data
    revalidatePath('/dashboard/missions');
    revalidatePath('/dashboard/missions', 'page');

    return {
      success: true,
      message: `Mission #${existingMission.missionNumber} validée avec succès`,
    };
  } catch (error) {
    console.error('Error validating mission:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la validation de la mission'] },
      success: false,
    };
  }
}
