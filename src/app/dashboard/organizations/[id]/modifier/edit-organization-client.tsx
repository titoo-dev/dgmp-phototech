"use client";

import { useActionState, useTransition, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateOrganization, FormState } from "@/actions/organization/update-organization";
import { inviteMember, InviteMemberFormState } from "@/actions/organization/invite-member";
import { removeMember } from "@/actions/organization/remove-member";
import { cancelInvitation } from "@/actions/organization/cancel-invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  Trash2,
  Users,
  Upload,
  X,
  CheckCircle2,
  XCircle,
  UserPlus,
  Mail,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

import type { Organization, Invitation, EditOrganizationClientProps, Role } from "./types";
import {
  getRoleBadgeVariant,
  getRoleDisplayName,
  generateSlug,
  validateSlugFormat,
} from "./utils";

export const EditOrganizationClient = ({
  organization,
  initialInvitations,
}: EditOrganizationClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Organization["members"][0] | null>(null);
  const [cancelInviteDialogOpen, setCancelInviteDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoUrl, setLogoUrl] = useState(organization.logo || "");
  const [logoPreview, setLogoPreview] = useState(organization.logo || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("u1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: FormState = {
    success: false,
  };

  const initialInviteState: InviteMemberFormState = {
    success: false,
  };

  const [state, formAction, isFormPending] = useActionState(updateOrganization, initialState);
  const [inviteState, inviteFormAction, isInvitePending] = useActionState(inviteMember, initialInviteState);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugTouched]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Organisation modifiée avec succès");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    if (inviteState.success) {
      toast.success(inviteState.message || "Invitation envoyée avec succès");
      setInviteEmail("");
      setInviteRole("u1");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else if (inviteState.message) {
      toast.error(inviteState.message);
    }
  }, [inviteState, router]);

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    startTransition(async () => {
      const result = await removeMember(selectedMember.id, organization.id);
      if (result.success) {
        toast.success(result.message || "Membre retiré avec succès");
        setRemoveDialogOpen(false);
        setSelectedMember(null);
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors du retrait du membre");
      }
    });
  };

  const handleCancelInvitation = async () => {
    if (!selectedInvitation) return;

    startTransition(async () => {
      const result = await cancelInvitation(selectedInvitation.id);
      if (result.success) {
        toast.success(result.message || "Invitation annulée avec succès");
        setCancelInviteDialogOpen(false);
        setSelectedInvitation(null);
        setInvitations(invitations.filter(inv => inv.id !== selectedInvitation.id));
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de l'annulation de l'invitation");
      }
    });
  };

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Seuls les fichiers image sont acceptés");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille du fichier ne doit pas dépasser 5 MB");
      return;
    }

    setIsUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const data = await response.json();
      setLogoUrl(data.url);
      setLogoPreview(data.url);
      toast.success("Logo uploadé avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'upload du logo");
      console.error("Logo upload error:", error);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const slugValidation = validateSlugFormat(slug);
  const showSlugValidation = slugTouched && !!slug;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 overflow-y-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/organizations">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Modifier l'organisation</h2>
          <p className="text-muted-foreground">{organization.name}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-6 max-w-4xl mx-auto pb-8">
        {/* Organization Info Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations de l'organisation
            </CardTitle>
            <CardDescription>Modifiez les informations de l'organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="id" value={organization.id} />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom de l'organisation <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {state.fieldErrors?.name && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{state.fieldErrors.name[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug (identifiant unique) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="slug"
                        name="slug"
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value);
                          setSlugTouched(true);
                        }}
                        onBlur={() => setSlugTouched(true)}
                        pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                        className={showSlugValidation ? (slugValidation.isValid ? "pr-10 border-green-500" : "pr-10 border-red-500") : ""}
                        required
                      />
                      {showSlugValidation && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {slugValidation.isValid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {showSlugValidation && !slugValidation.isValid && slugValidation.message && (
                      <p className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        {slugValidation.message}
                      </p>
                    )}
                    {state.fieldErrors?.slug && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{state.fieldErrors.slug[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo de l'organisation</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="logo-file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <input type="hidden" name="logo" value={logoUrl} />

                    {!logoPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {isUploadingLogo ? (
                          <>
                            <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-3" />
                            <p className="text-sm text-gray-600">Upload en cours...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700">Cliquez pour uploader un logo</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF jusqu'à 5MB</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Logo uploadé</p>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{logoUrl}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleRemoveLogo}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {state.fieldErrors?.logo && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{state.fieldErrors.logo[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Statistiques</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date de création</span>
                        <Badge variant="outline">
                          {format(new Date(organization.createdAt), "dd MMM yyyy", { locale: fr })}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nombre de membres</span>
                        <Badge>{organization._count.members}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Membres actifs</span>
                        <Badge>{organization.members.length}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <Button type="submit" disabled={isFormPending}>
                {isFormPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les modifications
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Members Management */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Inviter un membre
            </CardTitle>
            <CardDescription>
              Invitez des utilisateurs à rejoindre l'organisation avec un rôle spécifique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={inviteFormAction} className="space-y-4">
              <input type="hidden" name="organizationId" value={organization.id} />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="invite-email">
                    Adresse e-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invite-email"
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                  {inviteState.fieldErrors?.email && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>{inviteState.fieldErrors.email[0]}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-role">
                    Rôle <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="role"
                    value={inviteRole}
                    onValueChange={(value: Role) => setInviteRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="u1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Agent de terrain
                        </div>
                      </SelectItem>
                      <SelectItem value="u2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Responsable missions
                        </div>
                      </SelectItem>
                      <SelectItem value="u3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Rédacteur magazine
                        </div>
                      </SelectItem>
                      <SelectItem value="u4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-yellow-600" />
                          Administrateur système
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {inviteState.fieldErrors?.role && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>{inviteState.fieldErrors.role[0]}</span>
                    </div>
                  )}
                </div>
              </div>


              <Button type="submit" disabled={isInvitePending}>
                {isInvitePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Mail className="mr-2 h-4 w-4" />
                Envoyer l'invitation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Members */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membres de l'organisation ({organization.members.length})
            </CardTitle>
            <CardDescription>
              Liste des membres actuels de l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {organization.members.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Aucun membre</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Invitez des membres pour commencer à collaborer
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date d'ajout</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organization.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {member.user.image ? (
                            <img
                              src={member.user.image}
                              alt={member.user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <Users className="h-4 w-4" />
                            </div>
                          )}
                          {member.user.name}
                        </div>
                      </TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(member.role) as any}>
                          {getRoleDisplayName(member.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(member.createdAt), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setRemoveDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Invitations en attente ({invitations.length})
              </CardTitle>
              <CardDescription>
                Liste des invitations envoyées en attente d'acceptation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Invité par</TableHead>
                    <TableHead>Expire le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {invitation.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(invitation.role) as any}>
                          {getRoleDisplayName(invitation.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{invitation.inviter.name}</TableCell>
                      <TableCell>
                        {format(new Date(invitation.expiresAt), "dd MMM yyyy HH:mm", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {invitation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInvitation(invitation);
                            setCancelInviteDialogOpen(true);
                          }}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer le membre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir retirer <strong>{selectedMember?.user.name}</strong> de l'organisation ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Retirer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Invitation Dialog */}
      <Dialog open={cancelInviteDialogOpen} onOpenChange={setCancelInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler l'invitation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler l'invitation envoyée à <strong>{selectedInvitation?.email}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelInviteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleCancelInvitation} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
