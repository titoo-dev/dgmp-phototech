import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground opacity-90" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Accès non autorisé
          </h1>
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>

        <Card className="border shadow-none">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter votre administrateur.
              </p>
              <Button asChild className="h-10 w-full">
                <Link href="/">
                  Retour à l&apos;accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Besoin d&apos;aide ?{" "}
          <Link 
            href="/contact" 
            className="text-foreground hover:text-primary underline underline-offset-4 font-medium"
          >
            Contactez le support
          </Link>
        </div>
      </div>
    </div>
  );
}
