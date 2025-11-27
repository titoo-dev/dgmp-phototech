"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RefreshCw } from "lucide-react";
import { resendVerificationEmailAction, type ResendVerificationEmailFormState } from "@/actions/resend-verification-email";
import { useActionState } from "react";

const VerifyEmailPage = () => {
  const [showResendForm, setShowResendForm] = useState(false);
  const [state, formAction, isPending] = useActionState<ResendVerificationEmailFormState, FormData>(
    resendVerificationEmailAction,
    {}
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              MarketScan
            </CardTitle>
            <CardDescription className="text-center text-base">
              Système de Gestion Sécurisé MarketScan
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8 text-center space-y-6">
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Nous avons envoyé un lien de vérification à votre adresse email. Veuillez consulter votre boîte de réception et cliquer sur le lien pour vérifier votre compte.
              </p>
            </div>

            {state.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{state.message}</p>
              </div>
            )}

            {state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{state.error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowResendForm(!showResendForm)}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Renvoyer l'email de vérification
              </Button>

              {showResendForm && (
                <form action={formAction} className="space-y-4">
                  <div className="text-left space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer le lien de vérification
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 MarketScan DGMP. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

