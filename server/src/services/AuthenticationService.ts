import { IUserWithoutPassword } from '../models/IUserModel';
import * as bcrypt from "bcrypt";
import fs from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const usersDir = "./data/users";
const usersFile = `${usersDir}/users.json`;
if (!existsSync("./data")) mkdirSync("./data");
if (!existsSync(usersDir)) mkdirSync(usersDir);
if (!existsSync(usersFile)) writeFileSync(usersFile, "{}");

interface IUserTable {
    [key: string]: string;
}

const getUserTable = async (): Promise<IUserTable> => {
    const file = await fs.open(usersFile, "r");
    const usersJSON = (await file.readFile()).toString();

    return JSON.parse(usersJSON);
};

const saveUserTable = async (users: IUserTable): Promise<void> => {
    const file = await fs.open(usersFile, "w");
    await file.writeFile(JSON.stringify(users));
    await file.close();
};

export const GetAllUsers = async (): Promise<Array<IUserWithoutPassword>> => {
    const usersTable = await getUserTable();
    const usersArray = Object.keys(usersTable).map(
        (key) => ({
            username: key
        })
    );

    return usersArray;
};

export const RegisterUser = async (username: string, password: string, confPassword: string): Promise<boolean> => {
    if (password !== confPassword) {
        return false;
    }

    try {
        const users = await getUserTable();
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);
        users[username] = hashedPassword;
        await saveUserTable(users);
        return true;
    } catch (error) {
        return false;
    }
};

export const LoginUser = async (username: string, password: string) => {
    const users = await getUserTable();
    const hashedPassword = users[username];

    return await bcrypt.compare(password, hashedPassword);
};

export const DeleteUser = async (username: string) => {
    const users = await getUserTable();

    if (Object.keys(users).length > 1) {
        delete users[username];
        await saveUserTable(users);
        return true;
    }

    return false;
};