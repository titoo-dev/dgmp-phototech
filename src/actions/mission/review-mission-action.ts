"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ReviewMissionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function reviewMissionAction(
  missionId: string,
  reviewComment: string
): Promise<ReviewMissionState> {
  try {
    // Validate inputs
    if (!missionId || typeof missionId !== 'string') {
      return {
        errors: { _form: ['ID de mission invalide'] },
        success: false,
      };
    }

    if (!reviewComment || reviewComment.trim().length === 0) {
      return {
        errors: { _form: ['Le commentaire de révision est requis'] },
        success: false,
      };
    }

    if (reviewComment.trim().length > 1000) {
      return {
        errors: { _form: ['Le commentaire ne peut pas dépasser 1000 caractères'] },
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
        errors: { _form: ['Seules les missions en attente peuvent être révisées'] },
        success: false,
      };
    }

    // Update mission status to REJECTED and add review comment
    await prisma.mission.update({
      where: { id: missionId },
      data: { 
        status: MissionStatus.REJECTED,
        // We'll need to add a reviewComment field to the Mission model
        // For now, we'll store it in a separate table or skip this part
      },
    });

    // Send email notification to team leader with review comment
    try {
      await resend.batch.send([{
        from: 'MarketScan <noreply@titosy.dev>',
        to: [existingMission.teamLeader.email],
        subject: `Mission à réviser - Mission #${existingMission.missionNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
              Mission à Réviser 📝
            </h2>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #dc2626; margin-top: 0;">Mission #${existingMission.missionNumber}</h3>
              <p><strong>Chef d'équipe:</strong> ${existingMission.teamLeader.name}</p>
              <p><strong>Lieu:</strong> ${existingMission.location}</p>
              <p><strong>Période:</strong> Du ${new Date(existingMission.startDate).toLocaleDateString('fr-FR')} au ${new Date(existingMission.endDate).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <p>Votre mission nécessite des révisions avant validation. Veuillez consulter les commentaires ci-dessous :</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <h4 style="margin-top: 0; color: #334155;">Commentaires de révision :</h4>
              <p style="white-space: pre-wrap; margin-bottom: 0; color: #475569;">${reviewComment}</p>
            </div>
            
            <p>Veuillez apporter les modifications nécessaires et soumettre à nouveau votre mission.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/missions" 
                 style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
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
      console.error('Error sending review email:', emailError);
      // Don't fail the entire operation if email fails
    }

    // Revalidate the missions page to show updated data
    revalidatePath('/dashboard/missions');
    revalidatePath('/dashboard/missions', 'page');

    return {
      success: true,
      message: `Mission #${existingMission.missionNumber} renvoyée pour révision`,
    };
  } catch (error) {
    console.error('Error reviewing mission:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la révision de la mission'] },
      success: false,
    };
  }
}
