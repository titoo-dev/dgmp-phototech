import { MissionStatus } from "@/lib/generated/prisma";


// Helper function to get status display name
export function getStatusDisplayName(status: MissionStatus): string {
    switch (status) {
        case MissionStatus.DRAFT:
            return 'Brouillon';
        case MissionStatus.PENDING:
            return 'En attente';
        case MissionStatus.COMPLETED:
            return 'Validé';
        case MissionStatus.REJECTED:
            return 'Refusé';
        default:
            return status;
    }
}

// Helper function to get available status transitions
export function getAvailableStatusTransitions(currentStatus: MissionStatus): MissionStatus[] {
    switch (currentStatus) {
        case MissionStatus.DRAFT:
            return [MissionStatus.PENDING, MissionStatus.REJECTED];
        case MissionStatus.PENDING:
            return [MissionStatus.COMPLETED, MissionStatus.REJECTED, MissionStatus.DRAFT];
        case MissionStatus.COMPLETED:
            return [MissionStatus.PENDING]; // Can reopen if needed
        case MissionStatus.REJECTED:
            return [MissionStatus.DRAFT, MissionStatus.PENDING];
        default:
            return Object.values(MissionStatus).filter(status => status !== currentStatus);
    }
}
