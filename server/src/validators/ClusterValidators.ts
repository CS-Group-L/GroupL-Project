import { body, check } from 'express-validator';
import { hasFile, isFiletype } from '../utils/FileValidation';
import HandleValidation from '../utils/HandleValidation';

export const ClusterPushValidator = HandleValidation([
    body()
        .custom(hasFile("file")).withMessage("No file uploaded with key 'file'")
        .custom(isFiletype("file", ".py")).withMessage("The uploaded file must be a Python file"),
]);
export const ClusterPushCodeValidator = HandleValidation([
    body("code")
        .notEmpty().withMessage("Code must not be empty")
        .isString().withMessage("Code must be a string")
        .isLength({ min: 4 }).withMessage("Code must have a minimum length of 4")
]);
