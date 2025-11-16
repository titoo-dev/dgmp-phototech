"use client";

import { useActionState, useTransition, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { adminSignUpAction, type AdminSignUpFormState } from "@/actions/admin-sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const initialState: AdminSignUpFormState = {};

const AdminSignUpClientPage = () => {
  const [state, formAction] = useActionState(adminSignUpAction, initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"u4" | "u5">("u5");
  
  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Compte administrateur créé avec succès ! Redirection...");
    }
  }, [state.error, state.success, state.redirect, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Création de compte administrateur
          </CardTitle>
          <CardDescription className="text-center">
            <div className="flex items-start gap-2 text-sm bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg mt-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                  Accès réservé aux administrateurs système
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                  Cette page sera désactivée après la configuration initiale
                </p>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Entrez votre nom complet"
                required
                aria-invalid={!!state.fieldErrors?.name}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                aria-invalid={!!state.fieldErrors?.email}
              />
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 caractères"
                required
                aria-invalid={!!state.fieldErrors?.password}
              />
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+241 XX XX XX XX"
                aria-invalid={!!state.fieldErrors?.phoneNumber}
              />
              {state.fieldErrors?.phoneNumber && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.phoneNumber[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Rôle administrateur <span className="text-red-500">*</span>
              </Label>
              <Select
                name="role"
                value={selectedRole}
                onValueChange={(value: "u4" | "u5") => setSelectedRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="u5">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Gestionnaire organisation (U5)</p>
                        <p className="text-xs text-muted-foreground">Gestion des organisations</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="u4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="font-medium">Administrateur système (U4)</p>
                        <p className="text-xs text-muted-foreground">Accès complet au système</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {state.fieldErrors?.role && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.role[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Création du compte..." : "Créer le compte administrateur"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Déjà un compte?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignUpClientPage;

