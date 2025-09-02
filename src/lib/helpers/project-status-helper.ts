import { ProjectStatus } from "@/lib/generated/prisma";

export function getAvailableStatusTransitions(currentStatus: ProjectStatus): ProjectStatus[] {
  switch (currentStatus) {
    case ProjectStatus.UNCONTROLLED:
      return [ProjectStatus.CONTROLLED_IN_PROGRESS, ProjectStatus.DISPUTED];
    case ProjectStatus.CONTROLLED_IN_PROGRESS:
      return [ProjectStatus.CONTROLLED_DELIVERED, ProjectStatus.CONTROLLED_OTHER, ProjectStatus.DISPUTED];
    case ProjectStatus.CONTROLLED_DELIVERED:
      return [ProjectStatus.CONTROLLED_OTHER, ProjectStatus.DISPUTED];
    case ProjectStatus.CONTROLLED_OTHER:
      return [ProjectStatus.CONTROLLED_DELIVERED, ProjectStatus.DISPUTED];
    case ProjectStatus.DISPUTED:
      return [ProjectStatus.UNCONTROLLED, ProjectStatus.CONTROLLED_IN_PROGRESS];
    default:
      return [];
  }
}

export function getStatusDisplayName(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.UNCONTROLLED:
      return "Non contrôlé";
    case ProjectStatus.CONTROLLED_IN_PROGRESS:
      return "En cours";
    case ProjectStatus.CONTROLLED_DELIVERED:
      return "Livré";
    case ProjectStatus.CONTROLLED_OTHER:
      return "Autre";
    case ProjectStatus.DISPUTED:
      return "En litige";
    default:
      return status;
  }
}
