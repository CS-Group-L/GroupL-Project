import { Response } from 'express';
import { IServiceResponse } from '../models/ResponseModel';

export const sendError = <T>(resp: Response, response: IServiceResponse<T>) => {
    return resp.status(response.code).end(response.msg);
};

export const sendData = <T>(resp: Response, response: IServiceResponse<T>) => {
    return resp.send(response.data);
};

export const Send = <T>(resp: Response, response: IServiceResponse<T>) => {
    if (response.isError) return sendError(resp, response);
    return sendData(resp, response);
};