"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";
import { getUsersAction } from "@/actions/user/get-users-action";
import { sendEmailByApi } from "@/lib/email/send-email";

export type SendMissionReportState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function sendMissionReportAction(
  missionId: string
): Promise<SendMissionReportState> {
  try {
    // Validate inputs
    if (!missionId || typeof missionId !== 'string') {
      return {
        errors: { _form: ['ID de mission invalide'] },
        success: false,
      };
    }

    // Check if mission exists and is in DRAFT status
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

    if (existingMission.status !== MissionStatus.DRAFT) {
      return {
        errors: { _form: ['Seules les missions en brouillon peuvent être envoyées'] },
        success: false,
      };
    }

    // Update mission status to PENDING
    await prisma.mission.update({
      where: { id: missionId },
      data: { status: MissionStatus.PENDING },
    });

    // Get all u2 users (validators)
    const u2UsersResult = await getUsersAction("u2");
    
    if (u2UsersResult.error || !u2UsersResult.users.length) {
      // Mission status was updated but email failed - still return success
      console.warn('No u2 users found for email notification');
      revalidatePath('/dashboard/missions');
      return {
        success: true,
        message: `Mission #${existingMission.missionNumber} envoyée avec succès (aucun validateur trouvé pour notification)`,
      };
    }

    try {
      const validUsers = u2UsersResult.users.filter(user => user.emailVerified && !user.banned);
      
      for (const user of validUsers) {
        try {
          await sendEmailByApi({
            to: user.email,
            subject: `Nouvelle mission à valider - Mission #${existingMission.missionNumber}`,
            template: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                  Nouvelle Mission à Valider
                </h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #007bff; margin-top: 0;">Mission #${existingMission.missionNumber}</h3>
                  <p><strong>Chef d'équipe:</strong> ${existingMission.teamLeader.name} (${existingMission.teamLeader.email})</p>
                  <p><strong>Lieu:</strong> ${existingMission.location}</p>
                  <p><strong>Période:</strong> Du ${new Date(existingMission.startDate).toLocaleDateString('fr-FR')} au ${new Date(existingMission.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <p>Une nouvelle mission a été soumise pour validation et nécessite votre attention.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/missions" 
                     style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Voir la mission
                  </a>
                </div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;">
                <p style="color: #6c757d; font-size: 14px; text-align: center;">
                  DGMP Photothèque - Système de gestion des missions
                </p>
              </div>
            `,
            context: {},
          });
        } catch (individualEmailError) {
          console.error(`Failed to send email to ${user.email}:`, individualEmailError);
        }
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
    }

    // Revalidate the missions page to show updated data
    revalidatePath('/dashboard/missions');
    revalidatePath('/dashboard/missions', 'page');

    return {
      success: true,
      message: `Mission #${existingMission.missionNumber} envoyée avec succès pour validation`,
    };
  } catch (error) {
    console.error('Error sending mission report:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de l\'envoi de la mission'] },
      success: false,
    };
  }
}
