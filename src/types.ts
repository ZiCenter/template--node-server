import {Request} from "express";

export interface IRequest extends Request {
    token?: string
    user?: any
}

