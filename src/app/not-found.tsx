import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-[400px] w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Page non trouvée
          </h1>
          <p className="text-sm text-muted-foreground">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href="/">
            <Button className="h-10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
