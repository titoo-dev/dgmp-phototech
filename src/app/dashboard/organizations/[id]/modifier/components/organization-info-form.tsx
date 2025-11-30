"use client";

import { useActionState, useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Building2,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

import type { Organization } from "../types";
import { useLogoUpload } from "../hooks/use-logo-upload";
import { useSlugValidation } from "../hooks/use-slug-validation";
import { useEffect } from "react";

interface OrganizationInfoFormProps {
  organization: Organization;
}

export const OrganizationInfoForm = ({ organization }: OrganizationInfoFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(organization.name);

  const {
    logoUrl,
    logoPreview,
    isUploadingLogo,
    uploadLogo,
    removeLogo,
  } = useLogoUpload(organization.logo || "");

  const {
    slug,
    validation,
    showValidation,
    handleSlugChange,
    handleSlugBlur,
  } = useSlugValidation(name, organization.slug || "");

  const initialState: FormState = {
    success: false,
  };

  const [state, formAction, isFormPending] = useActionState(updateOrganization, initialState);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };

  const handleRemoveLogo = () => {
    removeLogo();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
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
                    onChange={(e) => handleSlugChange(e.target.value)}
                    onBlur={handleSlugBlur}
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    className={showValidation ? (validation.isValid ? "pr-10 border-green-500" : "pr-10 border-red-500") : ""}
                    required
                  />
                  {showValidation && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {validation.isValid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {showValidation && !validation.isValid && validation.message && (
                  <p className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {validation.message}
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
  );
};

