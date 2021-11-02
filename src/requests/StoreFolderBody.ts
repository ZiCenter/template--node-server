import {IsArray} from "class-validator";

export class StoreFolderBody {
    @IsArray()
    names!: string[]
}
