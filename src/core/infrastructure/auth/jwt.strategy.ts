
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {UserService} from "../../application/services/user.service";
import {ConfigService} from "@nestjs/config";
import {Observable, of, switchMap} from "rxjs";
import {UserEntity} from "../../domain/entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    validate(payload: any):Observable<UserEntity> {
        return of(1).pipe(
            switchMap(()=> this.userService.getUserById(payload.sub))
        )
    }
}
