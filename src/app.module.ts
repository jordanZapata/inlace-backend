import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthController} from "./auth/auth.controller";
import {UserController} from "./user/user.controller";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {JwtStrategy} from "./core/infrastructure/auth/jwt.strategy";
import {AuthService} from "./core/application/services/auth.service";
import {PostEntity} from "./core/domain/entities/post.entity";
import {UserEntity} from "./core/domain/entities/user.entity";
import {AuthModule} from "./core/infrastructure/auth/auth.module";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, PostEntity],
      synchronize: true,
    }),
    AuthModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET, // Accede a la variable de entorno aquí
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService, JwtStrategy],
})
export class AppModule {}
