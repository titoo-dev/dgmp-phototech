export interface Photo {
    id: number;
    url: string;
    file: File;
}

export interface Market {
    id: number;
    name: string;
    photos: Photo[];
    remarks: string;
}
