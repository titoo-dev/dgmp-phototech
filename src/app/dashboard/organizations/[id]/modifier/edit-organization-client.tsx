"use client";

import { useActionState, useTransition, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateOrganization, FormState } from "@/actions/organization/update-organization";
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
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

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
      image: string | null;
    };
  }>;
  _count: {
    members: number;
  };
};

type AvailableAdmin = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type EditOrganizationClientProps = {
  organization: Organization;
  availableAdmins: AvailableAdmin[];
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Enregistrer les modifications
    </Button>
  );
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const validateSlugFormat = (slug: string): { isValid: boolean; message?: string } => {
  if (!slug) return { isValid: false };
  if (slug.length < 2) return { isValid: false, message: "Minimum 2 caractères" };
  if (slug.length > 50) return { isValid: false, message: "Maximum 50 caractères" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { isValid: false, message: "Lettres minuscules, chiffres et tirets uniquement" };
  }
  return { isValid: true };
};

export const EditOrganizationClient = ({
  organization,
  availableAdmins: initialAvailableAdmins,
}: EditOrganizationClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Organization["members"][0] | null>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoUrl, setLogoUrl] = useState(organization.logo || "");
  const [logoPreview, setLogoPreview] = useState(organization.logo || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: FormState = {
    success: false,
  };

  const [state, formAction] = useActionState(updateOrganization, initialState);

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
  const showSlugValidation = slugTouched && slug;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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

      <div className="flex flex-col items-center space-y-4">
        {/* Organization Info Form */}
        <Card className="w-full max-w-4xl">
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

              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {/* Admin Management */}
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administrateurs de l'organisation
            </CardTitle>
            <CardDescription>
              Gérez les administrateurs (u4) qui ont accès à cette organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

          {/* Current Admins Table */}
          {organization.members.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun administrateur</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajoutez un administrateur pour gérer cette organisation
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
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
                      <Badge className="bg-red-100 text-red-800">
                        Administrateur (u4)
                      </Badge>
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
      </div>
    </div>
  );
};
