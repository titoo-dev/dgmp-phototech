"use client";

import { useActionState, useTransition, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signUpAction, type SignUpFormState } from "@/actions/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

const initialState: SignUpFormState = {};

const SignUpClientPage = () => {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const invitationId = searchParams.get("invitationId");
  const prefillEmail = searchParams.get("email");
  
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
      toast.success("Compte créé avec succès ! Redirection...");
    }
  }, [state.error, state.success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {invitationId ? "Créez votre compte pour rejoindre l'organisation" : "Créez votre compte"}
          </CardTitle>
          <CardDescription className="text-center">
            {invitationId ? (
              <div className="flex items-center justify-center gap-2 text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300">
                  Vous avez été invité à rejoindre une organisation
                </span>
              </div>
            ) : (
              <>
                Ou{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  connectez-vous à votre compte existant
                </Link>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={handleSubmit} className="space-y-4">
            {invitationId && (
              <input type="hidden" name="invitationId" value={invitationId} />
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Entrez votre nom"
                aria-invalid={!!state.fieldErrors?.name}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Entrez votre email"
                defaultValue={prefillEmail || ""}
                required
                readOnly={!!invitationId}
                disabled={!!invitationId}
                aria-invalid={!!state.fieldErrors?.email}
                className={invitationId ? "bg-muted cursor-not-allowed" : ""}
              />
              {invitationId && (
                <p className="text-xs text-muted-foreground">
                  L'email est verrouillé car cette inscription est liée à une invitation.
                </p>
              )}
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Entrez votre mot de passe"
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
              <Label htmlFor="phoneNumber">Numéro de téléphone (optionnel)</Label>
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

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Création du compte..." : "Créer un compte"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpClientPage;
