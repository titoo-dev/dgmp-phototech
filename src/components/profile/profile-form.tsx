"use client";

import { useState, useTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateProfileAction, updateAvatarAction } from "@/actions/user/update-profile-action";
import { toast } from "sonner";
import { Camera, Loader2, Mail, User, Calendar, Shield, Phone } from "lucide-react";
import { AuthUser, getUserRole } from "@/lib/auth-utils";

interface ProfileFormProps {
  user: AuthUser & {
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
  };
}

const roleLabels = {
  u1: "Agent de mission",
  u2: "Responsable",
  u3: "Rédacteur",
  u4: "Administrateur",
  u5: "Super Administrateur"
};

type ProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  
  const userRole = getUserRole(user);
  
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(
    async (prevState: ProfileState, formData: FormData) => {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const phoneNumber = formData.get('phoneNumber') as string;
      
      const result = await updateProfileAction({ name, email, phoneNumber });
      
      if (result.success) {
        toast.success("Profil mis à jour avec succès");
        return { success: true };
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
        return { 
          success: false, 
          error: result.error,
          fieldErrors: result.fieldErrors
        };
      }
    },
    { success: false }
  );

  const [isUploadingAvatar, startUploadTransition] = useTransition();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    startUploadTransition(async () => {
      try {
        const result = await updateAvatarAction(file);
        
        if (result.success && result.data?.image) {
          setAvatarUrl(result.data.image);
          toast.success("Avatar mis à jour avec succès");
        } else {
          toast.error(result.error || "Erreur lors de la mise à jour de l'avatar");
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la mise à jour de l'avatar");
      }
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Informations du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du profil
          </CardTitle>
          <CardDescription>
            Gérez vos informations personnelles et votre avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage className="object-cover" src={avatarUrl} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
                className="hidden"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Photo de profil</p>
              <p className="text-sm text-muted-foreground">
                Cliquez sur l'icône pour changer votre avatar
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou GIF. Taille maximum 5MB.
              </p>
            </div>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                placeholder="Votre nom complet"
                defaultValue={user.name || ""}
                disabled={isPending}
                className={state.fieldErrors?.name ? "border-red-500" : ""}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-red-500">{state.fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                defaultValue={user.email || ""}
                disabled={isPending}
                className={state.fieldErrors?.email ? "border-red-500" : ""}
              />
              {state.fieldErrors?.email && (
                <p className="text-sm text-red-500">{state.fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Numéro de téléphone
                </div>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+241 XX XX XX XX"
                defaultValue={(user as any).phoneNumber || ""}
                disabled={isPending}
                className={state.fieldErrors?.phoneNumber ? "border-red-500" : ""}
              />
              {state.fieldErrors?.phoneNumber && (
                <p className="text-sm text-red-500">{state.fieldErrors.phoneNumber}</p>
              )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour le profil"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Informations du compte
          </CardTitle>
          <CardDescription>
            Détails de votre compte et permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Rôle
              </div>
              <Badge variant="outline" className="w-fit">
                {roleLabels[userRole]}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email vérifié
              </div>
              <Badge variant={user.emailVerified ? "default" : "destructive"} className="w-fit">
                {user.emailVerified ? "Vérifié" : "Non vérifié"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Compte créé
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Dernière modification
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
