import {NextFunction, Request, Response} from "express";
import logger from "@shared/Logger";
import {BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED} from "http-status-codes";
import {ExpressErrorMiddlewareInterface, Middleware} from "routing-controllers";
import {customResp} from "@shared/functions";

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(err: Error, req: Request, res: Response, next: any) {
        if (err.name === 'UnauthorizedError')
            return customResp.error(res, UNAUTHORIZED, "Invalid Authorization");
        else if (err.name === 'AccessDeniedError')
            return customResp.error(res, FORBIDDEN, "Access Denied");
        console.log(err.name, err.message)
        return customResp.error(res, INTERNAL_SERVER_ERROR, "Server Error");
    }
}
