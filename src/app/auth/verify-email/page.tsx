import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const VerifyEmailPage = () => {
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

