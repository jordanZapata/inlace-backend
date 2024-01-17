import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import {PostEntity} from "../../domain/entities/post.entity";
import {PostRepository} from "../../domain/repositories/post.repository";
import {UserEntity} from "../../domain/entities/user.entity";


@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostRepository)
        private readonly postRepository: PostRepository,
    ) {}

    createPost(userId: number, data: Partial<PostEntity>): Observable<PostEntity> {
        const post = this.postRepository.create({ ...data, user: { id: userId } });
        return from(this.postRepository.save(post));
    }

    getAllPosts(): Observable<PostEntity[]> {
        return from(this.postRepository.find());
    }

    getPostById(postId: number): Observable<PostEntity> {
        const options: FindOneOptions<PostEntity> = { where: { id: postId } };
        return from(this.postRepository.findOne(options)).pipe(
            map((post) => {
                if (!post) {
                    throw new NotFoundException('Post not found');
                }
                return post;
            }),
        );
    }

    updatePost(postId: number, data: Partial<PostEntity>): Observable<PostEntity> {
        const options: FindOneOptions<PostEntity> = { where: { id: postId } };
        return this.getPostById(postId).pipe(
            switchMap((post:PostEntity) => {
                if (!post) {
                    throw new NotFoundException('User not found');
                }
                return from(this.postRepository.update(postId, data)).pipe(
                    switchMap(() => this.postRepository.findOne(options)),
                    catchError(() => of(null)), // Handle errors during the update
                );
            }),
        );
    }

    deletePost(postId: number): Observable<PostEntity> {
        return this.getPostById(postId).pipe(
            switchMap((post:PostEntity) => {
                if (!post) {
                    throw new NotFoundException('User not found');
                }
                post.deletedAt = new Date();
                return from(this.postRepository.save(post)).pipe(
                    map((deletedPost: PostEntity) => {
                        // Map the saved user to include the 'deletedAt' property
                        return { ...post, deletedAt: deletedPost.deletedAt };
                    }),
                    catchError(() => of(null)), // Handle errors during the save
                );
            }),
        );
    }

    hardDeletePost(postId: number): Observable<void> {
        return from(this.getPostById(postId)).pipe(
            switchMap((post:PostEntity) => {
                if (!post) {
                    throw new NotFoundException('User not found');
                }

                return from(this.postRepository.remove(post)).pipe(
                    switchMap(() => {
                        // Return void
                        return from(Promise.resolve());
                    }),
                );
            }),
        );
    }
}