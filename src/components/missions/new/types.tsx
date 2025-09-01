export interface Photo {
    id: number;
    url: string;
    file: File;
    uploaded?: boolean;
    uploadData?: any;
}

import type { ProjectWithCompany } from '@/actions/project/get-projects-action';

export interface Market {
    id: number;
    name: string;
    photos: Photo[];
    remarks: string;
    selectedProject: ProjectWithCompany | null;
}
