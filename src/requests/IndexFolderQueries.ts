import {IsAlpha, IsBoolean, IsEnum, IsPositive} from "class-validator";

enum Roles {
    Admin = "admin",
    User = "user",
    Guest = "guest",
}

export class IndexFolderQueries {
    @IsPositive()
    page = 1;

    @IsPositive()
    perPage = 15;

    @IsAlpha()
    name?: string;

    @IsEnum(Roles)
    role?: Roles;

    @IsBoolean()
    isActive?: boolean;
}
