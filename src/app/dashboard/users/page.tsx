"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  User, 
  Mail,
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  UserPlus
} from "lucide-react"
import Link from "next/link"

export default function UtilisateursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const users = [
    {
      id: 1,
      name: "Jean Mvé",
      email: "jean.mve@dgmp.ga",
      role: "u1",
      status: "active",
      lastLogin: "2024-01-15T10:30:00",
      createdAt: "2023-08-15T09:00:00",
      projectsCount: 5,
      reportsCount: 23
    },
    {
      id: 2,
      name: "Marie Nkomo",
      email: "marie.nkomo@dgmp.ga",
      role: "u2",
      status: "active",
      lastLogin: "2024-01-14T16:45:00",
      createdAt: "2023-06-10T14:30:00",
      projectsCount: 12,
      reportsCount: 156
    },
    {
      id: 3,
      name: "Paul Ondimba",
      email: "paul.ondimba@dgmp.ga",
      role: "u1",
      status: "inactive",
      lastLogin: "2024-01-10T08:15:00",
      createdAt: "2023-09-22T11:20:00",
      projectsCount: 3,
      reportsCount: 8
    },
    {
      id: 4,
      name: "Sophie Mintsa",
      email: "sophie.mintsa@dgmp.ga",
      role: "u3",
      status: "active",
      lastLogin: "2024-01-15T14:20:00",
      createdAt: "2023-07-03T16:45:00",
      projectsCount: 0,
      reportsCount: 0
    },
    {
      id: 5,
      name: "Michel Obame",
      email: "michel.obame@dgmp.ga",
      role: "u4",
      status: "active",
      lastLogin: "2024-01-15T09:00:00",
      createdAt: "2023-05-15T10:00:00",
      projectsCount: 25,
      reportsCount: 0
    },
    {
      id: 6,
      name: "Claire Ekomy",
      email: "claire.ekomy@dgmp.ga",
      role: "u1",
      status: "pending",
      lastLogin: null,
      createdAt: "2024-01-14T17:30:00",
      projectsCount: 0,
      reportsCount: 0
    }
  ]


  const getRoleBadge = (role: string) => {
    switch (role) {
      case "u1":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <User className="w-3 h-3 mr-1" />
            Agent terrain
          </Badge>
        )
      case "u2":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Shield className="w-3 h-3 mr-1" />
            Responsable
          </Badge>
        )
      case "u3":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Edit className="w-3 h-3 mr-1" />
            Rédacteur
          </Badge>
        )
      case "u4":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Shield className="w-3 h-3 mr-1" />
            Administrateur
          </Badge>
        )
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <UserX className="w-3 h-3 mr-1" />
            Inactif
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredUtilisateurs = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Jamais connecté"
    
    const date = new Date(lastLogin)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "À l'instant"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    
    return date.toLocaleDateString('fr-FR')
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et leurs permissions
          </p>
        </div>
        <Button asChild>
          <Link href="/users/new">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Rôle
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrer par rôle</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                  Tous les rôles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("u1")}>
                  Agent terrain
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("u2")}>
                  Responsable
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("u3")}>
                  Rédacteur
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("u4")}>
                  Administrateur
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Statut
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Tous les statuts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Actif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  Inactif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  En attente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {/* Data Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Projets</TableHead>
                <TableHead>Rapports</TableHead>
                <TableHead>Membre depuis</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUtilisateurs.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        #{user.id.toString().padStart(3, '0')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatLastLogin(user.lastLogin)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.projectsCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.reportsCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}/modifier`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-orange-600">
                            <UserX className="w-4 h-4 mr-2" />
                            Désactiver
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUtilisateurs.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par créer votre premier utilisateur"
                }
              </p>
              {!searchQuery && roleFilter === "all" && statusFilter === "all" && (
                <Button asChild>
                  <Link href="/users/new">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer un utilisateur
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
