import { body } from 'express-validator';
import HandleValidation from '../utils/HandleValidation';

const usernameSchema = body("username")
    .exists().withMessage("Username must not be empty")
    .notEmpty().withMessage("Username must not be empty")
    .isString().withMessage("Username must be a string");

const usernameCreateSchema = body("username")
    .exists().withMessage("Username must not be empty")
    .notEmpty().withMessage("Username must not be empty")
    // .isString().withMessage("Username must be a string")
    .isLength({ min: 4 }).withMessage("A username must at least have a length of 8 characters");

const passwordSchema = body("password")
    .exists().withMessage("Password must not be empty")
    .notEmpty().withMessage("Password must not be empty")
    .isString().withMessage("Password must be a string");


const passwordRegisterSchema = body("password")
    .exists().withMessage("Password must not be empty")
    .notEmpty().withMessage("Password must not be empty")
    .isString().withMessage("Password must be a string")
    .isStrongPassword().withMessage("Password must at least have a length of 8, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol");
const passwordChangeSchema = passwordRegisterSchema;


const passwordConfChain = body("confPassword")
    .exists().withMessage("Confirmation password must not be empty")
    .notEmpty().withMessage("Confirmation password must not be empty")
    .isString().withMessage("Confirmation password must be a string")
    .custom(
        (value, { req }) => value === req.body.password
    ).withMessage("Confirmation password does not match with password");

export const loginValidator = HandleValidation([
    usernameSchema,
    passwordSchema
]);

export const registerValidator = HandleValidation([
    usernameCreateSchema,
    passwordRegisterSchema,
    passwordConfChain
]);

export const changePasswordValidator = HandleValidation([
    passwordChangeSchema,
    passwordConfChain
]);

export const deleteUserValidator = HandleValidation([
    usernameSchema
]);

export const hasAccessValidator = HandleValidation([
    usernameSchema
]);