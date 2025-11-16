"use client";

import { useActionState, useTransition, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createOrganization, FormState } from "@/actions/organization/create-organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, Building2, Loader2, Upload, X, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import Image from "next/image";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Créer l'organisation
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

export const NewOrganizationClient = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: FormState = {
    success: false,
  };

  const [state, formAction] = useActionState(createOrganization, initialState);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugTouched]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Organisation créée avec succès");
      setTimeout(() => {
        router.push("/dashboard/organizations");
      }, 2000);
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nouvelle organisation</h2>
          <p className="text-muted-foreground">Créez une nouvelle organisation dans le système</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col items-center space-y-4">
        <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations de l'organisation
          </CardTitle>
          <CardDescription>Remplissez les informations de la nouvelle organisation</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nom de l'organisation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Direction Générale des Marchés Publics"
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
                  placeholder="Ex: dgmp"
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
              <p className="text-sm text-muted-foreground">
                Généré automatiquement à partir du nom. Utilisé dans les URLs. Lettres minuscules, chiffres et tirets uniquement.
              </p>
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

            <Separator />

            <div className="flex items-center gap-4">
              <SubmitButton />
              <Link href="/dashboard/organizations">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
        </Card>

        <Card className="w-full max-w-2xl border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Prochaine étape : Ajouter un administrateur
                </p>
                <p className="text-sm text-blue-700">
                  Après avoir créé l'organisation, vous pourrez lui assigner un administrateur (u4)
                  qui gérera les utilisateurs, missions et projets de cette organisation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
