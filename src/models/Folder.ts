import * as Mongoose from "mongoose";
import {array, Model, model, prop, id, indexed, defaults} from "mongoose-typescript";

@model('folder', {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})
export class Folder extends Model<Folder> {
    @id()
    public readonly _id?: Mongoose.Schema.Types.ObjectId
    @prop() @indexed() public userId?: string
    @prop() public name?: string
    @prop() public mood?: string
    @prop() public topic?: { niche: string, subNiche?: string }[]
    @prop() @defaults(false) public paid?: boolean
    @prop() public cost?: number
    @prop() public created_at?: Date
    @prop() public updated_at?: Date

    public get imageUrl(): string {
        return ""
    }
}
