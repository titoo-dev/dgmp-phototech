import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  MapPin, 
  Building2, 
  Users, 
  Camera, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const stats = [
    {
      title: "Rapports de mission",
      value: "127",
      description: "Total des missions créés",
      icon: FileText,
      trend: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Projets actifs",
      value: "23",
      description: "Projets en cours",
      icon: Building2,
      trend: "+5%",
      color: "text-green-600"
    },
    {
      title: "Photos archivées",
      value: "2,847",
      description: "Images dans la base",
      icon: Camera,
      trend: "+18%",
      color: "text-purple-600"
    },
    {
      title: "Utilisateurs actifs",
      value: "18",
      description: "Agents connectés",
      icon: Users,
      trend: "+2",
      color: "text-orange-600"
    }
  ]

  const recentReports = [
    {
      id: 1,
      title: "Contrôle chantier Route Nationale 1",
      location: "Libreville",
      date: "2024-01-15",
      status: "validated",
      photos: 12
    },
    {
      id: 2,
      title: "Inspection Pont de la Mondah",
      location: "Libreville",
      date: "2024-01-14",
      status: "pending",
      photos: 8
    },
    {
      id: 3,
      title: "Suivi construction École primaire",
      location: "Port-Gentil",
      date: "2024-01-13",
      status: "in_progress",
      photos: 15
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3 mr-1" />En cours</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de votre activité de contrôle des chantiers DGMP
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ce mois
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reports */}
        <Card className="shadow-none gap-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rapports récents</CardTitle>
                <CardDescription>
                  Dernières missions de contrôle
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/missions">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {report.title}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {report.location}
                    <span className="mx-2">•</span>
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(report.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(report.status)}
                    <span className="text-xs text-muted-foreground">
                      {report.photos} photos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-none gap-4">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button className="justify-start h-12" asChild>
                <Link href="/missions/nouveau">
                  <FileText className="w-4 h-4 mr-2" />
                  Créer un nouveau rapport
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-12" asChild>
                <Link href="/projects">
                  <Building2 className="w-4 h-4 mr-2" />
                  Gérer les projects
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-12" asChild>
                <Link href="/missions">
                  <Camera className="w-4 h-4 mr-2" />
                  Parcourir les photos
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-12" asChild>
                <Link href="/users">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les utilisateurs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Missions à valider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
            <p className="text-xs text-muted-foreground">
              Rapports en attente de validation
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/missions?status=pending">
                Voir les missions →
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Photos récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">48</div>
            <p className="text-xs text-muted-foreground">
              Images ajoutées cette semaine
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/photos">
                Parcourir la galerie →
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Magazine DGMP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">
              Contenus prêts pour publication
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/magazine">
                Voir les contenus →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
