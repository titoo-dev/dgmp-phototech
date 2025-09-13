"use client"

import * as React from "react"
import Link from "next/link"
import type { CompanyModel } from "@/models/company-schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, Building, FileText, Package, Target, Plus } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import DatePickerField from "@/components/date-picker/date-picker-field"

type FormState = {
  success?: boolean
  errors?: {
    title?: string[]
    startDate?: string[]
    endDate?: string[]
    companyId?: string[]
    description?: string[]
    nature?: string[]
    status?: string[]
  }
  message?: string
}

type FormDraftData = {
  title: string;
  startDate: string;
  endDate: string;
  companyId: string;
  description: string;
  nature: string;
  status: string;
};

interface ProjectFormFieldsProps {
  state: FormState;
  companies: CompanyModel[];
  formData: FormDraftData;
  onFieldChange: (field: keyof FormDraftData, value: string) => void;
}

export default function ProjectFormFields({ state, companies, formData, onFieldChange }: ProjectFormFieldsProps) {

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="border-border/50 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Informations du projet
            </CardTitle>
            <CardDescription>Renseignez les informations principales du projet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Titre du projet
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="title" 
                  name="title" 
                  type="text" 
                  placeholder="ex: Construction du pont de Libreville" 
                  className="pl-10 h-12" 
                  value={formData.title}
                  onChange={(e) => onFieldChange('title', e.target.value)}
                  aria-invalid={!!state.errors?.title} 
                />
              </div>
              {state.errors?.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.title[0]}
                </p>
              )}
            </div>

            {/* Dates - improved with proper state management */}
            <div className="grid gap-4 sm:grid-cols-2">
                <DatePickerField
                    id="startDate"
                    name="startDate"
                    label="Date de début"
                    placeholder="Sélectionner une date"
                    value={formData.startDate}
                    onChange={(value) => onFieldChange('startDate', value || '')}
                    error={state.errors?.startDate?.[0]}
                    required
                />

                <DatePickerField
                    id="endDate"
                    name="endDate"
                    label="Date de fin"
                    placeholder="Sélectionner une date"
                    value={formData.endDate}
                    onChange={(value) => onFieldChange('endDate', value || '')}
                    error={state.errors?.endDate?.[0]}
                    required
                />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="companyId" className="text-sm font-medium text-foreground">
                  Entreprise responsable
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  asChild
                >
                  <Link href="/dashboard/companies/new">
                    <Plus className="h-3 w-3" />
                    Nouvelle entreprise
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Select 
                  name="companyId" 
                  value={formData.companyId} 
                  defaultValue={formData.companyId}
                  onValueChange={(value) => onFieldChange('companyId', value)}
                  key={`company-${formData.companyId}`}
                >
                  <SelectTrigger className="pl-10 h-12 w-full text-left" aria-invalid={!!state.errors?.companyId}>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.length === 0 ? (
                      <SelectItem value="" disabled>Aucune entreprise disponible</SelectItem>
                    ) : (
                      companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {state.errors?.companyId && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.companyId[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description du projet
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Décrivez en détail les objectifs et spécifications du projet..." 
                className="min-h-[120px] resize-none" 
                value={formData.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                aria-invalid={!!state.errors?.description} 
              />
              {state.errors?.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Classification du projet
            </CardTitle>
            <CardDescription>Nature et statut du projet de marché public</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nature */}
            <div className="space-y-2">
              <Label htmlFor="nature" className="text-sm font-medium text-foreground">
                Nature du projet
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select 
                  name="nature" 
                  value={formData.nature} 
                  defaultValue={formData.nature}
                  onValueChange={(value) => onFieldChange('nature', value)}
                  key={`nature-${formData.nature}`}
                >
                  <SelectTrigger className="pl-10 h-12 w-full text-left">
                    <SelectValue placeholder="Sélectionner la nature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPPLY">Fourniture de Matériels</SelectItem>
                    <SelectItem value="SERVICES">Prestation Services</SelectItem>
                    <SelectItem value="INTELLECTUAL">Prestation intellectuelle</SelectItem>
                    <SelectItem value="PROGRAM">Programme</SelectItem>
                    <SelectItem value="MIXED">Mixte</SelectItem>
                    <SelectItem value="CONTROLLED_EXPENSES">Dépenses contrôlées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {state.errors?.nature && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.nature[0]}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-foreground">
                Statut du projet
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select 
                  name="status" 
                  value={formData.status} 
                  defaultValue={formData.status}
                  onValueChange={(value) => onFieldChange('status', value)}
                  key={`status-${formData.status}`}
                >
                  <SelectTrigger className="pl-10 h-12 w-full text-left">
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNCONTROLLED">Non contrôlé</SelectItem>
                    <SelectItem value="CONTROLLED_IN_PROGRESS">Contrôlé - En cours</SelectItem>
                    <SelectItem value="CONTROLLED_DELIVERED">Contrôlé - Livré</SelectItem>
                    <SelectItem value="CONTROLLED_OTHER">Contrôlé - Autre</SelectItem>
                    <SelectItem value="DISPUTED">En Litige</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {state.errors?.status && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.status[0]}
                </p>
              )}
            </div>

            {/* Project Info Card */}
            <div className="rounded-lg bg-muted/30 p-4">
              <h4 className="font-medium text-sm text-foreground mb-2">Information sur les statuts</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Non contrôlé :</strong> Projet en attente de contrôle</li>
                <li>• <strong>Contrôlé - En cours :</strong> Contrôle en progression</li>
                <li>• <strong>Contrôlé - Livré :</strong> Projet livré et vérifié</li>
                <li>• <strong>Contrôlé - Autre :</strong> Contrôle spécial</li>
                <li>• <strong>En Litige :</strong> Problème détecté</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
