import {IsAlpha, IsArray} from "class-validator";

export class UpdateFolderBody {
    @IsAlpha()
    name!: string
}
