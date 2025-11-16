"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { deleteOrganization } from "@/actions/organization/delete-organization";
import { toast } from "sonner";
import { Building2, MoreVertical, Plus, Search, Trash2, Edit, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Organization = {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string | null;
    };
  }>;
  _count: {
    missions: number;
    projects: number;
    companies: number;
    contacts: number;
  };
};

type OrganizationsClientProps = {
  initialOrganizations: Organization[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const OrganizationsClient = ({
  initialOrganizations,
  initialPagination,
}: OrganizationsClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.push(`/dashboard/organizations?${params.toString()}`);
    });
  }, 500);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`/dashboard/organizations?${params.toString()}`);
    });
  };

  const handleDelete = async () => {
    if (!selectedOrganization) return;

    const result = await deleteOrganization(selectedOrganization.id);

    if (result.success) {
      toast.success(`Organisation "${result.data?.name}" supprimée avec succès`);
      setDeleteDialogOpen(false);
      setSelectedOrganization(null);
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organisations</h2>
          <p className="text-muted-foreground">
            Gérez les organisations et leurs administrateurs
          </p>
        </div>
        <Link href="/dashboard/organizations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle organisation
          </Button>
        </Link>
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou slug..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Liste des organisations
          </CardTitle>
          <CardDescription>
            {initialPagination.total} organisation(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialOrganizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucune organisation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Commencez par créer une nouvelle organisation
              </p>
              <Link href="/dashboard/organizations/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une organisation
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Administrateurs</TableHead>
                    <TableHead>Statistiques</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {org.logo ? (
                            <img
                              src={org.logo}
                              alt={org.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                              <Building2 className="h-4 w-4" />
                            </div>
                          )}
                          {org.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{org.slug || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{org.members.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {org._count.missions} missions
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {org._count.projects} projets
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(org.createdAt), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/dashboard/organizations/${org.id}/modifier`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedOrganization(org);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {initialPagination.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (initialPagination.page > 1) {
                              handlePageChange(initialPagination.page - 1);
                            }
                          }}
                          className={
                            initialPagination.page === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: initialPagination.totalPages }, (_, i) => i + 1).map(
                        (pageNumber) => {
                          const isCurrentPage = pageNumber === initialPagination.page;
                          const showPage =
                            pageNumber === 1 ||
                            pageNumber === initialPagination.totalPages ||
                            (pageNumber >= initialPagination.page - 1 &&
                              pageNumber <= initialPagination.page + 1);

                          if (!showPage) {
                            if (
                              pageNumber === initialPagination.page - 2 ||
                              pageNumber === initialPagination.page + 2
                            ) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }
                            return null;
                          }

                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNumber);
                                }}
                                isActive={isCurrentPage}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (initialPagination.page < initialPagination.totalPages) {
                              handlePageChange(initialPagination.page + 1);
                            }
                          }}
                          className={
                            initialPagination.page === initialPagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'organisation "
              {selectedOrganization?.name}" ? Cette action est irréversible.
              <br />
              <br />
              <strong>Note:</strong> Vous ne pouvez supprimer une organisation que si elle ne contient
              aucune donnée (missions, projets, entreprises, contacts).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
