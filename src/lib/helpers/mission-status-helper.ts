import { MissionStatus } from "@/lib/generated/prisma";

// Helper function to get badge variant for status
export function getStatusBadgeVariant(status: MissionStatus): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case MissionStatus.DRAFT:
            return 'outline';
        case MissionStatus.PENDING:
            return 'secondary';
        case MissionStatus.COMPLETED:
            return 'default';
        case MissionStatus.REJECTED:
            return 'destructive';
        default:
            return 'outline';
    }
}

// Helper function to get custom badge classes for better color consistency
export function getStatusBadgeClasses(status: MissionStatus): string {
    switch (status) {
        case MissionStatus.DRAFT:
            return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
        case MissionStatus.PENDING:
            return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
        case MissionStatus.COMPLETED:
            return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
        case MissionStatus.REJECTED:
            return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
}

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
