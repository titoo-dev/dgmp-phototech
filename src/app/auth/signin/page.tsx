"use client";

import { useActionState, useTransition, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signInAction, type SignInFormState } from "@/actions/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const initialState: SignInFormState = {};

const SignInPage = () => {
  const [state, formAction] = useActionState(signInAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success && state.redirect) {
      toast.success("Connexion réussie ! Redirection...");
      router.push(state.redirect);
    }
  }, [state.error, state.success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connectez-vous à votre compte
          </CardTitle>
          {process.env.DISABLE_SIGN_UP === "true" && (
            <CardDescription className="text-center">
              Ou{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:underline"
              >
                créer un nouveau compte
              </Link>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Entrez votre email"
                autoComplete="email"
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
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  autoComplete="current-password"
                  className="pr-10"
                  required
                  aria-invalid={!!state.fieldErrors?.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                name="rememberMe"
                value="true"
              />
              <Label 
                htmlFor="rememberMe" 
                className="text-sm font-normal cursor-pointer"
              >
                Se souvenir de moi
              </Label>
            </div>



            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
