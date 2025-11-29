import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth-guard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CheckCircle, ShieldAlert, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = await params;

  await verifySession();

  let invitation;
  
  try {
    invitation = await auth.api.getInvitation({
      headers: await headers(),
      query: {
        id: invitationId || "",
      }
    });

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: invitation.organizationId,
      },
    });
    
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-destructive opacity-90" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invitation introuvable
            </h1>
            <p className="text-sm text-muted-foreground">
              Cette invitation n&apos;existe pas ou a été supprimée.
            </p>
          </div>

          <Card className="border shadow-none">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Veuillez vérifier le lien d&apos;invitation ou contacter votre administrateur pour recevoir une nouvelle invitation.
                </p>
                <Button asChild className="h-10 w-full">
                  <Link href="/">
                    Retour à l&apos;accueil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (invitation.status === "pending") {
    console.log("Invitation already accepted");
    await auth.api.acceptInvitation({
      headers: await headers(),
      body: {
        invitationId: invitationId,
      },
    });

    return redirect(`/`);
  }

  if (invitation.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <ShieldAlert className="h-12 w-12 text-destructive opacity-90" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invitation refusée
            </h1>
            <p className="text-sm text-muted-foreground">
              Cette invitation a été refusée et ne peut plus être acceptée.
            </p>
          </div>

          <Card className="border shadow-none">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter votre administrateur pour recevoir une nouvelle invitation.
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

  if (invitation.status === "accepted") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-600 opacity-90" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invitation déjà acceptée
            </h1>
            <p className="text-sm text-muted-foreground">
              Cette invitation a déjà été acceptée. Vous pouvez maintenant accéder à l&apos;application.
            </p>
          </div>

          <Card className="border shadow-none">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous êtes déjà membre de l&apos;organisation. Connectez-vous pour accéder à votre compte.
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

  if (invitation.status === "canceled") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-muted-foreground opacity-90" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invitation annulée
            </h1>
            <p className="text-sm text-muted-foreground">
              Cette invitation a été annulée par l&apos;administrateur et n&apos;est plus valide.
            </p>
          </div>

          <Card className="border shadow-none">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Si vous souhaitez rejoindre cette organisation, veuillez contacter votre administrateur pour recevoir une nouvelle invitation.
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
}

