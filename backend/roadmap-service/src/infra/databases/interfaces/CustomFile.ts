export interface CustomFile {
    filepath: string;
    newFilename: string;
    originalFilename: string;
    mimetype: string;
    size: number;
    [key: string]: any;
}