"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phoneNumber: z.string().optional(),
});

const updateAvatarSchema = z.object({
  image: z.string().url("URL d'image invalide"),
});

export async function updateProfileAction(data: z.infer<typeof updateProfileSchema>) {
  try {
    // Valider les données
    const validatedData = updateProfileSchema.parse(data);

    // Récupérer la session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Cet email est déjà utilisé par un autre utilisateur",
        fieldErrors: {
          email: "Cet email est déjà utilisé par un autre utilisateur",
        },
      };
    }

    // Mettre à jour le profil
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber || null,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        phoneNumber: updatedUser.phoneNumber,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    
    if (error instanceof z.ZodError) {
      const fieldErrors: { name?: string; email?: string; phoneNumber?: string } = {};
      
      error.issues.forEach((err) => {
        if (err.path[0] === 'name') {
          fieldErrors.name = err.message;
        } else if (err.path[0] === 'email') {
          fieldErrors.email = err.message;
        } else if (err.path[0] === 'phoneNumber') {
          fieldErrors.phoneNumber = err.message;
        }
      });

      return {
        success: false,
        error: error.issues.map(e => e.message).join(", "),
        fieldErrors,
      };
    }

    return {
      success: false,
      error: "Erreur lors de la mise à jour du profil",
    };
  }
}

export async function updateAvatarAction(file: File) {
  try {
    // Récupérer la session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }

    // Valider le fichier
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: "Seules les images sont autorisées",
      };
    }

    // Limiter la taille du fichier à 5MB
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "L'image ne peut pas dépasser 5MB",
      };
    }

    // Upload de l'image
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `avatar-${session.user.id}.${fileExtension}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
      multipart: true,
    });

    // Mettre à jour l'avatar dans la base de données
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: blob.url,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        image: updatedUser.image,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour de l'avatar",
    };
  }
}

export async function getProfileAction() {
  try {
    // Récupérer la session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }

    // Récupérer les informations du profil
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Utilisateur non trouvé",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du profil",
    };
  }
}
