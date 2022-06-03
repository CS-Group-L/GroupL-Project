import { IUserWithoutPassword } from '../models/IUserModel';
import { IServiceResponse, SR } from '../models/ResponseModel';
import * as bcrypt from "bcrypt";
import fs from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const usersDir = "./data/users";
const usersFile = `${usersDir}/users.json`;
if (!existsSync(usersDir)) mkdirSync(usersDir);
if (!existsSync(usersFile)) writeFileSync(usersFile, "{}");

interface IUserTable {
    [key: string]: string;
}

const getUserTable = async (): Promise<IUserTable> => {
    const file = await fs.open(usersFile, "r");
    const usersJSON = (await file.readFile()).toString();
    file.close();

    return JSON.parse(usersJSON);
};

const saveUserTable = async (users: IUserTable): Promise<void> => {
    const file = await fs.open(usersFile, "w");
    await file.writeFile(JSON.stringify(users));
    await file.close();
};

export const GetAllUsers = async (): Promise<IServiceResponse<Array<IUserWithoutPassword> | void>> => {
    const usersTable = await getUserTable();
    const usersArray = Object.keys(usersTable)
        .map((key) => ({
            username: key
        }));

    return SR.data(usersArray);
};

export const UserExists = async (username: string): Promise<IServiceResponse<boolean | void>> => {
    const user = (await getUserTable())[username];
    return SR.data(user !== null && user !== undefined);
};

export const RegisterUser = async (username: string, password: string, confPassword: string): Promise<IServiceResponse<boolean | void>> => {
    if (password !== confPassword) return SR.error(403, "Password and confirmation password don't match");

    const users = await getUserTable();
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = users[username];
    console.log(user);

    if (user) return SR.error(403, "User already exists");

    users[username] = hashedPassword;
    await saveUserTable(users);

    return SR.data(true);
};

export const LoginUser = async (username: string, password: string): Promise<IServiceResponse<boolean | void>> => {
    const users = await getUserTable();
    const hashedPassword = users[username];
    if (!hashedPassword) return SR.error(403, "Username or Password was incorrect");

    if (!await bcrypt.compare(password, hashedPassword)) {
        return SR.error(403, "Username or Password was incorrect");
    };

    return SR.data(true);
};

export const DeleteUser = async (username: string): Promise<IServiceResponse<boolean | void>> => {
    const users = await getUserTable();

    if (Object.keys(users).length > 1) {
        delete users[username];
        await saveUserTable(users);
        return SR.data(true);
    }

    return SR.error(403, "Last user cannot be deleted");
};