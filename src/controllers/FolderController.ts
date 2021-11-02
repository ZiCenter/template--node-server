import express, {Request, Response} from "express";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, } from "http-status-codes";
import { customResp } from "@shared/functions";
import {getModel} from "mongoose-typescript";
import {Folder} from "@models/Folder";
import {IRequest} from "../types";
import {
    Get,
    Post,
    Patch,
    Delete,
    JsonController,
    Param,
    Res,
    Req,
    Body,
    QueryParams, CurrentUser, Authorized
} from "routing-controllers";
import {IndexFolderQueries} from "../requests/IndexFolderQueries";
import {StoreFolderBody} from "../requests/StoreFolderBody";
import {UpdateFolderBody} from "../requests/UpdateFolderBody";


@JsonController("/folders")
export class FolderController {

    FolderModel = getModel(Folder)

    @Get("/")
    async index(/*@QueryParams() {page}: IndexFolderQueries,*/ @Req() {user: session}: any,
                @Res() res: any) {
        if (!session)
            return customResp.error(res, UNAUTHORIZED, "Unauthorized")
        const folders = await this.FolderModel.find({userId: session.sub})
        return customResp.success(res, {folders});
    }

    @Get("/:id([0-9a-z]+)")
    @Authorized(['user', 'guest'])
    async show(@CurrentUser() session: any,
               @Param("id") _id: string, @Res() res: Response) {
        if (!_id)
            return customResp.error(res, BAD_REQUEST, "Bad Request")
        if (!session)
            return customResp.error(res, UNAUTHORIZED, "Unauthorized")
        const folder = await this.FolderModel.findOne({_id, userId: session.sub});
        return customResp.success(res, {folder});
    }

    @Post("/")
    async store(@CurrentUser() session: any, @Body() {names}: StoreFolderBody,
                @Res() res: Response) {
        if (!names || !names.length)
            return customResp.error(res, BAD_REQUEST, "Bad Request")
        if (!session)
            return customResp.error(res, UNAUTHORIZED, "Unauthorized")
        const folder = await this.FolderModel.create(names.map(name => ({
            name,
            userId: session.sub
        })));
        return customResp.success(res, {folder});
    }

    @Patch("/:id([0-9a-z]+)")
    async update(@CurrentUser() session: any,
                 @Body() {name}: UpdateFolderBody, @Param("id") _id: number, @Res() res: Response) {
        if (!_id || !name)
            return customResp.error(res, BAD_REQUEST, "Bad Request")
        if (!session)
            return customResp.error(res, UNAUTHORIZED, "Unauthorized")
        const folder = await this.FolderModel.findOne({_id, userId: session.sub});
        if (folder) {
            folder.name = name || folder.name;
            await folder.save();
            return customResp.success(res, {folder})
        }
        return customResp.error(res, NOT_FOUND, "NOT FOUND")
    }

    @Delete("/:id([0-9a-z]+)")
    async delete(@CurrentUser() session: any,
                 @Param("id") _id: number, @Res() res: Response) {
        try {
            if (!_id)
                return customResp.error(res, BAD_REQUEST, "Bad Request")
            if (!session)
                return customResp.error(res, UNAUTHORIZED, "Unauthorized")
            await this.FolderModel.findOneAndDelete({_id, userId: session.sub});
            return customResp.success(res, undefined);
        } catch (e) {
            return customResp.error(res, NOT_FOUND, "NOT FOUND");
        }
    }

}

export default FolderController;
