import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {catchError, from, Observable, of, switchMap, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import {UserRepository} from "../../domain/repositories/user.repository";
import {UserEntity} from "../../domain/entities/user.entity";
import {FindOneOptions} from "typeorm";
import {PostEntity} from "../../domain/entities/post.entity";
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    createUser(data: Partial<UserEntity>): Observable<UserEntity> {
        const user = this.userRepository.create(data);
        return from(this.userRepository.save(user));
    }

    getAllUsers(): Observable<UserEntity[]> {
        return from(this.userRepository.find());
    }

    getUserById(userId: number): Observable<UserEntity> {
        const options: FindOneOptions<UserEntity> = { where: { id: userId } };
        return from(this.userRepository.findOne(options)).pipe(
            map((user) => {
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                return user;
            }),
        );
    }
    getUserByEmail(email: string): Observable<UserEntity> {
        const options: FindOneOptions<UserEntity> = { where: { email: email } };
        return from(this.userRepository.findOne(options)).pipe(
            map((user) => {
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                return user;
            }),
        );
    }


    updateUser(userId: number, data: Partial<UserEntity>): Observable<UserEntity> {
        const options: FindOneOptions<UserEntity> = { where: { id: userId } };
        return this.getUserById(userId).pipe(
            switchMap((user:UserEntity) => {
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                return from(this.userRepository.update(userId, data)).pipe(
                    switchMap(() => this.userRepository.findOne(options)),
                    catchError(() => of(null)), // Handle errors during the update
                );
            }),
        );
    }
    deleteUser(userId: number): Observable<UserEntity> {
        return this.getUserById(userId).pipe(
            switchMap((user: UserEntity) => {
                if (!user) {
                    throw new NotFoundException('User not found');
                }

                user.deletedAt = new Date();

                return from(this.userRepository.save(user)).pipe(
                    catchError((error) => throwError(error)),
                );
            }),
        );
    }

    hardDeleteUser(userId: number): Observable<void> {
        return from(this.getUserById(userId)).pipe(
            switchMap((user) => {
                if (!user) {
                    throw new NotFoundException('User not found');
                }

                return from(this.userRepository.remove(user)).pipe(
                    switchMap(() => {
                        // Return void
                        return from(Promise.resolve());
                    }),
                );
            }),
        );
    }
}