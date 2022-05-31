export interface IServiceResponse<T> {
    data?: T;
    isError: boolean;
    code?: number;
    msg?: string;
}

export const SR = {
    error: (code: number, msg: string): IServiceResponse<void> => {
        return { isError: true, code, msg };
    },

    data: <T>(data: T): IServiceResponse<T> => {
        return { isError: false, data };
    }
};