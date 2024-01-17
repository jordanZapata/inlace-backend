import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import {AuthService} from "../../application/services/auth.service";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}