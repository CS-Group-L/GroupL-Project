import { body, param } from 'express-validator';
import HandleValidation from '../utils/HandleValidation';

const usernameSchema = body("username")
    .exists().withMessage("Username must not be empty")
    .notEmpty().withMessage("Username must not be empty")
    .isString().withMessage("Username must be a string");

const deleteUsernameSchema = param("username")
    .exists().withMessage("Username must not be empty")
    .notEmpty().withMessage("Username must not be empty")
    .isString().withMessage("Username must be a string");

const usernameCreateSchema = body("username")
    .exists().withMessage("Username must not be empty")
    .notEmpty().withMessage("Username must not be empty")
    // .isString().withMessage("Username must be a string")
    .isLength({ min: 2 }).withMessage("A username must at least have a length of 2 characters");

const passwordSchema = body("password")
    .exists().withMessage("Password must not be empty")
    .notEmpty().withMessage("Password must not be empty")
    .isString().withMessage("Password must be a string");

const oldPasswordSchema = body("oldPassword")
    .exists().withMessage("Password must not be empty")
    .notEmpty().withMessage("Password must not be empty")
    .isString().withMessage("Password must be a string");

const newPasswordSchema = body("newPassword")
    .exists().withMessage("Password must not be empty")
    .notEmpty().withMessage("Password must not be empty")
    .isString().withMessage("Password must be a string")
    .isStrongPassword().withMessage("Password must at least have a length of 8, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol");

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

const newPasswordConfChain = body("confPassword")
    .exists().withMessage("Confirmation password must not be empty")
    .notEmpty().withMessage("Confirmation password must not be empty")
    .isString().withMessage("Confirmation password must be a string")
    .custom(
        (value, { req }) => value === req.body.newPassword
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
    oldPasswordSchema,
    newPasswordSchema,
    newPasswordConfChain
]);

export const deleteUserValidator = HandleValidation([
    deleteUsernameSchema
]);

export const hasAccessValidator = HandleValidation([
    usernameSchema
]);