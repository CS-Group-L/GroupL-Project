import { IUser } from '../models/IUserModel';

const getUserTable = async (): Promise<any> => {
    return {
        "user": "password"
    };
};

export const GetAllUsers = async (): Promise<Array<IUser>> => {
    const usersTable = await getUserTable();
    const usersArray = Object.keys(usersTable).map(
        (key) => ({
            username: key,
            password: usersTable[key]
        })
    );

    return usersArray;
};

export const RegisterUser = async (username: String, password: String) => {
    return false;
};

export const LoginUser = async (username: String, password: String) => {
    return false;
};

export const DeleteUser = async (username: String) => {
    return false;
};