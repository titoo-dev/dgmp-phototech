"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
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

interface User {
    id: string
    name: string
    email: string
    role: string
    banned?: boolean
    emailVerified?: boolean
    createdAt: string
    updatedAt: string
}

interface UsersClientProps {
    users: User[]
    total: number
    currentPage: number
    totalPages: number
    searchParams: {
        page?: string
        search?: string
        role?: string
        status?: string
    }
}

export function UsersClient({
    users,
    total,
    currentPage,
    totalPages,
    searchParams
}: UsersClientProps) {
    const router = useRouter()
    const searchParamsHook = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
    const [roleFilter, setRoleFilter] = useState(searchParams.role || "all")
    const [statusFilter, setStatusFilter] = useState(searchParams.status || "all")

    const updateSearchParams = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParamsHook.toString())

        Object.entries(newParams).forEach(([key, value]) => {
            if (value && value !== "all") {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        // Reset to page 1 when filters change
        if (newParams.search !== undefined || newParams.role !== undefined || newParams.status !== undefined) {
            params.delete("page")
        }

        startTransition(() => {
            router.push(`/dashboard/users?${params.toString()}`)
        })
    }

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        updateSearchParams({ search: value })
    }

    const handleRoleFilter = (role: string) => {
        setRoleFilter(role)
        updateSearchParams({ role })
    }

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status)
        updateSearchParams({ status })
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParamsHook.toString())
        params.set("page", page.toString())
        startTransition(() => {
            router.push(`/dashboard/users?${params.toString()}`)
        })
    }

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

    const getStatusBadge = (user: User) => {
        if (user.banned) {
            return (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    <UserX className="w-3 h-3 mr-1" />
                    Banni
                </Badge>
            )
        }

        if (!user.emailVerified) {
            return (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    <Clock className="w-3 h-3 mr-1" />
                    En attente
                </Badge>
            )
        }

        return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                Actif
            </Badge>
        )
    }


    const renderPaginationItems = () => {
        const items = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(i)
                            }}
                            isActive={i === currentPage}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(i)
                                }}
                                isActive={i === currentPage}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                )
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(totalPages)
                            }}
                            isActive={totalPages === currentPage}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )
            } else if (currentPage >= totalPages - 2) {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(1)
                            }}
                            isActive={1 === currentPage}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                )
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                )
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(i)
                                }}
                                isActive={i === currentPage}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
            } else {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(1)
                            }}
                            isActive={1 === currentPage}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                )
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                )
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(i)
                                }}
                                isActive={i === currentPage}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                )
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(totalPages)
                            }}
                            isActive={totalPages === currentPage}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
        }

        return items
    }

    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un utilisateur..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8"
                            disabled={isPending}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={isPending}>
                                <Filter className="w-4 h-4 mr-2" />
                                Rôle
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filtrer par rôle</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRoleFilter("all")}>
                                Tous les rôles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleFilter("u1")}>
                                Agent terrain
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleFilter("u2")}>
                                Responsable
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleFilter("u3")}>
                                Rédacteur
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleFilter("u4")}>
                                Administrateur
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={isPending}>
                                <Filter className="w-4 h-4 mr-2" />
                                Statut
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
                                Tous les statuts
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusFilter("active")}>
                                Actif
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusFilter("inactive")}>
                                Inactif
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusFilter("pending")}>
                                En attente
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Membre depuis</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                #{user.id.slice(-8)}
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
                                        {getStatusBadge(user)}
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
                                                    <Link href={`/dashboard/users/${user.id}`}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Voir
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/users/${user.id}/modifier`}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Modifier
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {user.banned ? (
                                                    <DropdownMenuItem className="text-green-600">
                                                        <UserCheck className="w-4 h-4 mr-2" />
                                                        Débannir
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="text-orange-600">
                                                        <UserX className="w-4 h-4 mr-2" />
                                                        Bannir
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

                    {users.length === 0 && (
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
                                    <Link href="/dashboard/users/new">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Créer un utilisateur
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Affichage de {((currentPage - 1) * 10) + 1} à {Math.min(currentPage * 10, total)} sur {total} utilisateurs
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage > 1) {
                                                    handlePageChange(currentPage - 1)
                                                }
                                            }}
                                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                    {renderPaginationItems()}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage < totalPages) {
                                                    handlePageChange(currentPage + 1)
                                                }
                                            }}
                                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
