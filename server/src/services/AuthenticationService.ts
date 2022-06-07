import { IUserWithoutPassword } from '../models/IUserModel';
import { IServiceResponse, SR } from '../models/ResponseModel';
import * as bcrypt from "bcrypt";
import fs from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { json } from 'body-parser';


const usersDir = "./data/users";
const usersFile = `${usersDir}/users.json`;

if (!existsSync("./data")) mkdirSync("./data");
if (!existsSync(usersDir)) mkdirSync(usersDir);

//Default login credentials:
// Username = admin
// Password = Password1.
if (!existsSync(usersFile)) writeFileSync(usersFile, '{"admin":"$2b$10$SZj6mpCQYnVmc2dZow9bzuScUsmjkB1RvNSWBFP4FVnG2QQgQOh1S"}');

interface IUserTable {
    [key: string]: string;
}

const generateAccessToken = async (username: string) => {
    const usersTable = await getUserTable();
    const user = usersTable[username];

    return jwt.sign({ user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

};

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

export const verifyAccessToken = async (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
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


export const LoginUser = async (username: string, password: string,): Promise<IServiceResponse<any | void>> => {
    const users = await getUserTable();
    const hashedPassword = users[username];
    //const accessToken = generateAccessToken(username);
    //const refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);

    if (!hashedPassword) return SR.error(403, "Username or Password was incorrect");

    if (!await bcrypt.compare(password, hashedPassword)) {
        return SR.error(403, "Username or Password was incorrect");
    };

    const accessToken = await generateAccessToken(username.toString());
    const tokens = {
        accessToken
    };
    return SR.data(await tokens);
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