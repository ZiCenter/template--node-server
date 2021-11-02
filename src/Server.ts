import 'reflect-metadata'
import morgan from 'morgan';
import helmet from 'helmet';

import cors from 'cors'

import express from 'express';
import {UNAUTHORIZED} from 'http-status-codes';
import 'express-async-errors';
import jwt from 'jsonwebtoken';

import logger from '@shared/Logger';
import {customResp} from "@shared/functions";
import {Action, useExpressServer} from "routing-controllers";
import {ErrorHandler} from "./middlewares/ErrorHandler";
import controllers from "./controllers"
import {User} from '@models/User';

class Server {

    app: any = express();

    constructor(public port: number) {
        this.doPrepareApp();
    }

    /************************************************************************************
     *                              Set basic express settings
     ***********************************************************************************/
    protected doPrepareApp(): void {

        useExpressServer(this.app, {
            cors: true,
            defaultErrorHandler: false,
            controllers: controllers, // we specify controllers we want to use
            middlewares: [
                ...(process.env.NODE_ENV === 'development') ? [morgan('dev')] : [],
                ...(process.env.NODE_ENV === 'production') ? [helmet()] : [],
                ErrorHandler
            ],
            authorizationChecker: this.authorized.bind(this),
            currentUserChecker: this.currentUser.bind(this),
            defaults: {
                nullResultCode: 404,
                undefinedResultCode: 500,
                paramOptions: {
                    required: true
                }
            }
        })

    }

    public listen() {
        this.app.listen(this.port, () => this.listenHandler());
    }

    protected authorized(action: Action, roles: string | string[]) {
        roles = roles instanceof Array ? roles : [roles]
        let user: User;
        try {
            const token = action.request.headers.authorization?.replace(/^bearer\s+/i, "")
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            user = jwt.verify(token, process.env.JWT_SECRET!) as User;
            return roles?.some(role => user.roles?.includes(role))
        } catch (e) {
            return false
        }
    }

    protected currentUser(action: Action): User | undefined {
        try {
            const token = action.request.headers.authorization?.replace(/^bearer\s+/i, "")
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return jwt.verify(token, process.env.JWT_SECRET!) as User;
        } catch (e) {
            return undefined
        }
    }

    /************************************************************************************
     *           when the express app is ready this handler is called
     ***********************************************************************************/
    protected listenHandler(): void {
        logger.info('Express server started on port: ' + this.port)
    }

    /************************************************************************************
     *             called if an error happend when initializing app
     ***********************************************************************************/
    protected initError(error: any): void {
        logger.info('Express server failed')
    }

}

export default Server;
