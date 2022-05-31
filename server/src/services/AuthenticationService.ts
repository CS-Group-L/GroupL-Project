import { IUserWithoutPassword } from '../models/IUserModel';
import * as bcrypt from "bcrypt";

interface IUserTable {
    [key: string]: string;
}

const getUserTable = async (): Promise<IUserTable> => {
    return {
        "user": "password"
    };
};

const saveUserTable = async (): Promise<boolean> => {

    return false;
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

export const RegisterUser = async (username: string, password: string, confPassword: string) => {
    if (password !== confPassword) {
        return false;
    }

    const users = await getUserTable();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    users[username] = hashedPassword;

    return users[username];
};

export const LoginUser = async (username: string, password: string) => {
    const users = await getUserTable();

    const hashedPassword = users[username];

    const isUser = await bcrypt.compare(password, hashedPassword);

    return isUser;
};

export const DeleteUser = async (username: string) => {
    const users = await getUserTable();

    if (Object.keys(users).length > 1) {
        delete users[username];
        return true;
    }
    
    return false;
};