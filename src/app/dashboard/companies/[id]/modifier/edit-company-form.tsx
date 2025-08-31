"use client";

import * as React from 'react';
import { useRef, useTransition } from 'react';
import { useActionState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Users,
  AlertCircle,
  Save,
  Globe,
  MapPin,
} from 'lucide-react';
import { updateCompanyAction } from '@/actions/company/update-company-action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  company: {
    id: number;
    name?: string | null;
    nif?: string | null;
    employeeCount?: number | null;
    email?: string | null;
    phoneNumber?: string | null;
    website?: string | null;
    address?: string | null;
  };
}

export default function EditCompanyForm({ company }: Props) {
  const [state, formAction] = useActionState(updateCompanyAction, {});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (state.success) {
      toast.success('Entreprise mise à jour', { description: 'Les modifications ont été enregistrées.' });
      router.push('/companies');
    } else if (state.errors?._form) {
      toast.error('Erreur', { description: state.errors._form[0] });
    }
  }, [state.success, state.errors, router]);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Modifier l&#39;entreprise</h1>
                <p className="text-sm text-muted-foreground">Mettre à jour les informations de l&#39;entreprise</p>
              </div>
            </div>
            <Button type="submit" form="company-form" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <form id="company-form" ref={formRef} action={handleSubmit}>
          <input type="hidden" name="id" value={company.id} />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-border/50 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" /> Informations principales
                  </CardTitle>
                  <CardDescription>Renseignez les informations de base de l&#39;entreprise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Dénomination de l&#39;entreprise <span className="text-destructive ml-1">*</span></Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="name" name="name" type="text" placeholder="ex: SARL Construction Excellence" className="pl-10 h-12" defaultValue={company.name ?? ''} aria-invalid={!!state.errors?.name} />
                    </div>
                    {state.errors?.name && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" />{state.errors.name[0]}</p>)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nif" className="text-sm font-medium text-foreground">Numéro d&apos;Identification Fiscale (NIF) <span className="text-destructive ml-1">*</span></Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="nif" name="nif" type="text" placeholder="ex: 2024XXXXXXXXX" className="pl-10 h-12" defaultValue={company.nif ?? ''} aria-invalid={!!state.errors?.nif} />
                    </div>
                    {state.errors?.nif && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" />{state.errors.nif[0]}</p>)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount" className="text-sm font-medium text-foreground">Effectif de l&#39;entreprise <span className="text-destructive ml-1">*</span></Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="employeeCount" name="employeeCount" type="number" min="1" placeholder="ex: 25" className="pl-10 h-12" defaultValue={company.employeeCount ?? undefined} aria-invalid={!!state.errors?.employeeCount} />
                    </div>
                    {state.errors?.employeeCount && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" />{state.errors.employeeCount[0]}</p>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-primary" /> Informations de contact</CardTitle>
                  <CardDescription>Coordonnées pour contacter l&apos;entreprise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Adresse email <span className="text-destructive ml-1">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" name="email" type="email" placeholder="contact@entreprise.ga" className="pl-10 h-12" defaultValue={company.email ?? ''} aria-invalid={!!state.errors?.email} />
                    </div>
                    {state.errors?.email && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" />{state.errors.email[0]}</p>)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">Numéro de téléphone <span className="text-destructive ml-1">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+241 XX XX XX XX" className="pl-10 h-12" defaultValue={company.phoneNumber ?? ''} aria-invalid={!!state.errors?.phoneNumber} />
                    </div>
                    {state.errors?.phoneNumber && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" />{state.errors.phoneNumber[0]}</p>)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-foreground">Site web (optionnel)</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="website" name="website" type="url" placeholder="https://www.entreprise.ga" className="pl-10 h-12" defaultValue={company.website || ''} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">Adresse (optionnel)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="address" name="address" type="text" placeholder="ex: BP 123, Libreville, Gabon" className="pl-10 h-12" defaultValue={company.address || ''} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
