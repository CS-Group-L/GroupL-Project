import { IUserWithoutPassword } from '../models/IUserModel';
import { IServiceResponse, SR } from '../models/ResponseModel';
import * as bcrypt from "bcrypt";
import fs from "fs/promises";
import { existsSync, mkdirSync, PathLike, writeFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';

interface IUserTable {
    [key: string]: string;
}

interface IAuthOptions {
    storagePath: PathLike,
    accessTokenSecret: string;
}

//Default login credentials:
// Username = admin
// Password = Password1.

export class AuthService {
    private storageFile: PathLike;
    private secret: string;

    constructor(config: IAuthOptions) {
        this.storageFile = `${config.storagePath}/users.json`;
        this.secret = config.accessTokenSecret;

        mkdirSync(config.storagePath, { recursive: true });
        if (!existsSync(this.storageFile)) writeFileSync(this.storageFile, '{"admin":"$2b$10$SZj6mpCQYnVmc2dZow9bzuScUsmjkB1RvNSWBFP4FVnG2QQgQOh1S"}');
    }

    private getUserTable = async (): Promise<IUserTable> => {
        const file = await fs.open(this.storageFile, "r");
        const usersJSON = (await file.readFile()).toString();
        file.close();
        return JSON.parse(usersJSON);
    };
    private saveUserTable = async (users: IUserTable): Promise<void> => {
        const file = await fs.open(this.storageFile, "w");
        await file.writeFile(JSON.stringify(users));
        await file.close();
    };

    private generateAccessToken = async (userdata: any) => {
        return jwt.sign(
            userdata,
            this.secret,
            { expiresIn: '1d' }
        );
    };

    public VerifyAccessToken = async (token: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    };

    public GetAllUsers = async (): Promise<IServiceResponse<Array<IUserWithoutPassword> | void>> => {
        const usersTable = await this.getUserTable();
        const usersArray = Object.keys(usersTable)
            .map((key) => ({
                username: key
            }));

        return SR.data(usersArray);
    };

    public UserExists = async (username: string): Promise<IServiceResponse<boolean | void>> => {
        const user = (await this.getUserTable())[username];
        return SR.data(user !== null && user !== undefined);
    };

    public RegisterUser = async (username: string, password: string, confPassword: string): Promise<IServiceResponse<boolean | void>> => {
        if (password !== confPassword) return SR.error(403, "Password and confirmation password don't match");

        const users = await this.getUserTable();
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = users[username];
        if (user) return SR.error(403, "User already exists");

        users[username] = hashedPassword;
        await this.saveUserTable(users);

        return SR.data(true);
    };


    public LoginUser = async (username: string, password: string,): Promise<IServiceResponse<any | void>> => {
        const users = await this.getUserTable();
        const hashedPassword = users[username];
        //const accessToken = generateAccessToken(username);
        //const refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);

        if (!hashedPassword) return SR.error(403, "Username or Password was incorrect");

        if (!await bcrypt.compare(password, hashedPassword)) {
            return SR.error(403, "Username or Password was incorrect");
        };

        const accessToken = await this.generateAccessToken({ username: username.toString() });
        if (!accessToken) return SR.error(403, "Username or Password was incorrect");
        const tokens = {
            accessToken
        };
        return SR.data(await tokens);
    };

    public ChangePassword = async (username: string, oldPass: string, newPass: string, confPass: string): Promise<IServiceResponse<boolean | void>> => {

        const users = await this.getUserTable();
        const salt = await bcrypt.genSalt();
        const hashedPassword = users[username];
        if (!hashedPassword)
            return SR.error(403, "User does not exist");
        if (!await bcrypt.compare(oldPass, hashedPassword))
            return SR.error(403, "Please enter the current password correctly");
        if (newPass !== confPass)
            return SR.error(403, "Confirm password does not match new password");


        const newHashedPass = await bcrypt.hash(newPass, salt);
        users[username] = newHashedPass;
        await this.saveUserTable(users);
        return SR.data(true);
    };

    public DeleteUser = async (username: string): Promise<IServiceResponse<boolean | void>> => {
        const users = await this.getUserTable();

        if (Object.keys(users).length <= 1)
            return SR.error(403, "Last user cannot be deleted");

        if (!users[username])
            return SR.error(403, "User doesn't exist");

        delete users[username];
        await this.saveUserTable(users);
        return SR.data(true);
    };
}