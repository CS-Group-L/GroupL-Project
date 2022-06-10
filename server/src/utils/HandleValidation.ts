import { Handler, NextFunction, Request, Response } from 'express';
import { ValidationChain, SanitizationChain, validationResult } from 'express-validator';

const ProcessErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    return next();
};

export default (validators: (ValidationChain | SanitizationChain)[]): Handler[] => {
    return [
        ...validators,
        ProcessErrors
    ];
};