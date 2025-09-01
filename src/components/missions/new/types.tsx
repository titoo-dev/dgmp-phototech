export interface Photo {
    id: number;
    url: string;
    file: File;
    uploaded?: boolean;
    uploadData?: any;
}

export interface Market {
    id: number;
    name: string;
    photos: Photo[];
    remarks: string;
}
