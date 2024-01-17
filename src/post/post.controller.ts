import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PostService } from 'src/core/application/services/post.service';
import {PostEntity} from "../core/domain/entities/post.entity";
import {AuthGuard} from "@nestjs/passport";
import {PostDto} from "../core/application/dto/post.dto";
import {Observable, of, switchMap} from "rxjs";

@Controller('post')

export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get(':id')
    getPostById(@Param('id') id: number): Observable<PostEntity> {
        return  of(1).pipe(
            switchMap(()=>this.postService.getPostById(id))
        );
    }

    @Get()
    getAllPosts(): Observable<PostEntity[]> {
        return  of(1).pipe(
            switchMap(()=> this.postService.getAllPosts())
        );
    }

    @Post()
    @UseGuards(AuthGuard)
     createPost(@Body() postDto: PostDto): Observable<PostEntity>  {
        return of(1).pipe(
            switchMap(()=> this.postService.createPost(postDto.userId, postDto))
        );
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    updatePost(@Param('id') id: number, @Body() postDto: PostDto):  Observable<PostEntity> {
        return of(1).pipe(
            switchMap(()=> this.postService.updatePost(id, postDto))
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deletePost(@Param('id') id: number): Promise<void> {
        await this.postService.deletePost(id);
    }
}