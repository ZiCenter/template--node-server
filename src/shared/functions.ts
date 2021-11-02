import logger from './Logger';
import {OK} from "http-status-codes";

import {Response} from "express";

export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};

export const customResp = {

    error(res: Response, code: number, message: string) {
        return res.status(code).json({success: false, message, code})
    },

    success(res: Response, data?: any, code?: number) {
        return res.status(code || OK).json({success: true, ...data && data})
    }
}

