import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {UserService} from "../core/application/services/user.service";
import {AuthGuard} from "../common/guards/auth.guard";
import {UserDto} from "../core/application/dto/user.dto";
import {UserEntity} from "../core/domain/entities/user.entity";
import {Observable, of, switchMap} from "rxjs";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @UseGuards(AuthGuard)
    getUserById(@Param('id') id: number):  Observable<UserEntity> {
        return of(1).pipe(
            switchMap(()=> this.userService.getUserById(id))
        );
    }

    @Get()
    @UseGuards(AuthGuard)
    getAllUsers(): Observable<UserEntity[]> {
        return of(1).pipe(
            switchMap(()=> this.userService.getAllUsers())
        )
    }

    @Post()
    createUser(@Body() userDto: UserDto): Observable<UserEntity> {
        return  of(1).pipe(
            switchMap(()=> this.userService.createUser(userDto))
        );
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    updateUser(@Param('id') id: number, @Body() userDto: UserDto):  Observable<UserEntity> {
        return of(1).pipe(
          switchMap(()=>this.userService.updateUser(id, userDto))
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }


}