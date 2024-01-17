import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import {AuthService} from "../core/application/services/auth.service";
import {mergeMap, Observable, of, switchMap} from "rxjs";
import {UserEntity} from "../core/domain/entities/user.entity";
import {AuthDto} from "../core/application/dto/auth.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() authDto: AuthDto):Observable<Object> {
        const { email, password } = authDto;
        return of(1).pipe(
            switchMap(()=> this.authService.validateUser(email, password)),
            mergeMap((user: UserEntity | null)=> {
                if (!user) {
                    throw new UnauthorizedException('Invalid credentials');
                }

                const token =  this.authService.login(user);

                return of(token);
            })
        )
    }
}