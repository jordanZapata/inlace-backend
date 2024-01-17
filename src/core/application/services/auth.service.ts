
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import {mergeMap, Observable, of, switchMap} from "rxjs";
import {UserEntity} from "../../domain/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    validateUser(email: string, password: string): Observable<UserEntity | null> {
      return of(1).pipe(
          switchMap(()=> this.userService.getUserByEmail(email)),
          mergeMap((user: UserEntity): Observable<UserEntity | null>=>{
              if (user && user.comparePassword(password)) {
                  return of(user);
              }
              return null;
          })
      );
    }

    async login(user: UserEntity): Promise<{ accessToken: string }> {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}