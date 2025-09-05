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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
    Edit,
    Trash2,
    Clock,
    CheckCircle,
    UserPlus
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { banUserAction } from "@/actions/user/ban-user"
import { unbanUserAction } from "@/actions/user/unban-user"
import { removeUserAction } from "@/actions/user/remove-user"

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
    const [banDialogOpen, setBanDialogOpen] = useState(false)
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

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

    const handleBanUser = (user: User) => {
        setSelectedUser(user)
        setBanDialogOpen(true)
    }

    const handleRemoveUser = (user: User) => {
        setSelectedUser(user)
        setRemoveDialogOpen(true)
    }

    const confirmBanUser = () => {
        if (!selectedUser) return

        startTransition(async () => {
            const formData = new FormData()
            formData.append("userId", selectedUser.id)

            let result
            if (selectedUser.banned) {
                result = await unbanUserAction({}, formData)
            } else {
                formData.append("banReason", "Banned by administrator")
                formData.append("banExpiresIn", "30") // 30 days
                result = await banUserAction({}, formData)
            }
            
            if (result.success) {
                const message = selectedUser.banned 
                    ? "Utilisateur débanni avec succès" 
                    : "Utilisateur banni avec succès"
                toast.success(message)
                setBanDialogOpen(false)
                setSelectedUser(null)
                router.refresh()
            } else {
                const errorMessage = selectedUser.banned 
                    ? "Erreur lors du débannissement" 
                    : "Erreur lors du bannissement"
                toast.error(result.error || errorMessage)
            }
        })
    }

    const confirmRemoveUser = () => {
        if (!selectedUser) return

        startTransition(async () => {
            const formData = new FormData()
            formData.append("userId", selectedUser.id)

            const result = await removeUserAction({}, formData)
            
            if (result.success) {
                toast.success("Utilisateur supprimé avec succès")
                setRemoveDialogOpen(false)
                setSelectedUser(null)
                router.refresh()
            } else {
                toast.error(result.error || "Erreur lors de la suppression")
            }
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
        <>
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
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <Select value={roleFilter} onValueChange={handleRoleFilter} disabled={isPending}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrer par rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les rôles</SelectItem>
                                    <SelectItem value="u1">Agent terrain</SelectItem>
                                    <SelectItem value="u2">Responsable</SelectItem>
                                    <SelectItem value="u3">Rédacteur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={handleStatusFilter} disabled={isPending}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="inactive">Inactif</SelectItem>
                                    <SelectItem value="pending">En attente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                                                    <DropdownMenuSeparator />
                                                    {user.banned ? (
                                                        <DropdownMenuItem 
                                                            className="text-green-600"
                                                            onClick={() => handleBanUser(user)}
                                                            disabled={isPending}
                                                        >
                                                            <UserCheck className="w-4 h-4 mr-2" />
                                                            Débannir
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem 
                                                            className="text-orange-600"
                                                            onClick={() => handleBanUser(user)}
                                                            disabled={isPending}
                                                        >
                                                            <UserX className="w-4 h-4 mr-2" />
                                                            Bannir
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem 
                                                        className="text-red-600"
                                                        onClick={() => handleRemoveUser(user)}
                                                        disabled={isPending}
                                                    >
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

            {/* Ban User Confirmation Dialog */}
            <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedUser?.banned ? "Débannir l'utilisateur" : "Bannir l'utilisateur"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser?.banned 
                                ? `Êtes-vous sûr de vouloir débannir ${selectedUser?.name} ?`
                                : `Êtes-vous sûr de vouloir bannir ${selectedUser?.name} ? Cette action empêchera l'utilisateur de se connecter.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmBanUser}
                            disabled={isPending}
                            className={selectedUser?.banned ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
                        >
                            {isPending ? "Traitement..." : (selectedUser?.banned ? "Débannir" : "Bannir")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Remove User Confirmation Dialog */}
            <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer {selectedUser?.name} ? Cette action est irréversible et supprimera définitivement toutes les données de l'utilisateur.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmRemoveUser}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isPending ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
