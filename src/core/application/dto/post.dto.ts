import { IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @IsString()
    readonly image: string;

    @IsNotEmpty()
    @IsString()
    readonly userId: number;
}