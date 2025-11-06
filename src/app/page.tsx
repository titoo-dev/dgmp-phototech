import { getSessionAction } from "@/actions/get-session";
import { AuthUser, getRedirectPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Camera,
  FileText,
  MapPin,
  Building2,
  Users,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Lock,
  Smartphone,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { session } = await getSessionAction();

  if (session?.user) {
    if (!session.user.emailVerified) {
      redirect("/auth/verify-email");
    }
    const redirectPath = getRedirectPath(session.user as AuthUser);
    redirect(redirectPath);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MarketScan</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Commencer</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Circular gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" style={{ animationDelay: '1s' }} />

        {/* Subtle mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mx-auto w-fit shadow-sm">
              Direction Générale des Marchés Publics
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Gestion intelligente des{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                missions de contrôle
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme sécurisée pour centraliser vos rapports de mission,
              archiver vos photos de chantier et capitaliser les données des marchés publics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="text-lg h-12 shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/auth/signup">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-12">
                <Link href="/auth/signin">Se connecter</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="h-px w-12 bg-border" />
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" asChild>
                <a href="#" download>
                  <Smartphone className="h-4 w-4" />
                  Télécharger l'app Android
                </a>
              </Button>
              <div className="h-px w-12 bg-border" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une solution complète pour gérer efficacement vos missions de contrôle
              et capitaliser vos données terrain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Rapports de mission</CardTitle>
                <CardDescription>
                  Créez, modifiez et validez vos rapports de mission en quelques clics.
                  Suivi complet du statut et historique des modifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Camera className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Photothèque centralisée</CardTitle>
                <CardDescription>
                  Archivez et recherchez facilement vos photos de chantier avec
                  extraction automatique des métadonnées (date, localisation).
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Building2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gestion des marchés</CardTitle>
                <CardDescription>
                  Suivez l'avancement de vos projets avec des vues Kanban, tableau
                  et calendrier. Associez facilement les marchés aux missions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Vue cartographique</CardTitle>
                <CardDescription>
                  Visualisez vos projets et missions sur une carte interactive.
                  Localisez rapidement les chantiers et leurs rapports associés.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Accès sécurisé</CardTitle>
                <CardDescription>
                  Gestion des rôles et permissions adaptée à votre organisation.
                  Contrôlez qui peut créer, modifier ou valider les rapports.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Smartphone className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Web & Mobile</CardTitle>
                <CardDescription>
                  Accessible depuis votre navigateur web et application mobile.
                  Capturez des photos directement sur le terrain.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Un workflow simple et efficace pour vos missions de contrôle
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Créez votre mission</h3>
                <p className="text-muted-foreground">
                  Remplissez le formulaire de mission avec les dates, le lieu, le projet concerné,
                  et ajoutez vos observations. Capturez ou importez des photos directement.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Validez les rapports</h3>
                <p className="text-muted-foreground">
                  Les responsables examinent les rapports soumis, peuvent demander des modifications
                  ou les valider. Toutes les versions sont conservées dans l'historique.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Exploitez vos données</h3>
                <p className="text-muted-foreground">
                  Recherchez et filtrez facilement vos rapports et photos. Exportez le contenu
                  pour alimenter le magazine hebdomadaire de la DGMP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">Sécurisé</div>
              <div className="text-primary-foreground/80">Authentification robuste</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">Collaboratif</div>
              <div className="text-primary-foreground/80">Travail d'équipe</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">Rapide</div>
              <div className="text-primary-foreground/80">Interface intuitive</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">Complet</div>
              <div className="text-primary-foreground/80">Toutes les fonctionnalités</div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Adapté à votre organisation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Différents rôles pour répondre aux besoins de chaque utilisateur
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Agent de mission</CardTitle>
                <CardDescription className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Créer des rapports de mission</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ajouter des photos et observations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Accès mobile sur le terrain</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Responsable</CardTitle>
                <CardDescription className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Valider les rapports de mission</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Gérer les projets et entreprises</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Vue d'ensemble des missions</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Rédacteur</CardTitle>
                <CardDescription className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Accès aux rapports validés</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Extraire photos et contenus</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Pour le magazine DGMP</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Administrateur</CardTitle>
                <CardDescription className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Gestion complète des utilisateurs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Configuration du système</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Accès à toutes les données</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à moderniser vos missions de contrôle ?
            </h2>
            <p className="text-muted-foreground text-lg">
              Rejoignez MarketScan et bénéficiez d'une plateforme sécurisée et intuitive
              pour gérer efficacement vos rapports de mission et archives photographiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg h-12">
                <Link href="/auth/signup">
                  Créer un compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-12">
                <Link href="/auth/signin">Se connecter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span className="font-semibold">MarketScan</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Direction Générale des Marchés Publics - Gabon
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

