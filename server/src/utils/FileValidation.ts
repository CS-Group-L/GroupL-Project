import { UploadedFile } from 'express-fileupload';
import { Meta } from 'express-validator';
import path from 'path';

export const hasFile = (fileName: string) => {
    return (_: any, { req }: Meta) => {
        if (!req?.files) return false;
        if (!req?.files[fileName]) return false;
        return true;
    };
};

export const isFiletype = (fileName: string, fileType: string) => {
    return (_: any, { req }: Meta) => {
        if (!req?.files) return false;
        const file = req.files[fileName] as UploadedFile;
        if (!file) return false;
        if (path.extname(file.name) !== fileType) return false;
        return true;
    };
};