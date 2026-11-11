export declare class StorageService {
    private s3;
    private uploadToAws;
    constructor();
    validateFile(file: Express.Multer.File): void;
    private generateKey;
    upload(file: Express.Multer.File, folder?: string): Promise<string>;
    delete(fileUrl: string): Promise<void>;
}
export declare const storageService: StorageService;
//# sourceMappingURL=StorageService.d.ts.map