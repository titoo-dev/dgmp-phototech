"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import type { Organization, Invitation } from "./types";
import { OrganizationInfoForm } from "./components/organization-info-form";
import { InviteMemberForm } from "./components/invite-member-form";
import { MembersList } from "./components/members-list";
import { PendingInvitationsList } from "./components/pending-invitations-list";

interface EditOrganizationClientProps {
  organization: Organization;
  initialInvitations: Invitation[];
}

export const EditOrganizationClient = ({
  organization,
  initialInvitations,
}: EditOrganizationClientProps) => {
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
        <OrganizationInfoForm organization={organization} />
        <InviteMemberForm organizationId={organization.id} />
        <MembersList members={organization.members} organizationId={organization.id} />
        <PendingInvitationsList invitations={initialInvitations} />
      </div>
    </div>
  );
};
