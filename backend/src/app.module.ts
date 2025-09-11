import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { User } from "./user/user.entity";
import { Patient } from "./patient/patient.entity";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import * as dotenv from "dotenv";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { GlobalAuthGuard } from "./auth/global-auth.guard";
import { RolesGuard } from "./user/roles.guard";
import { Reflector } from "@nestjs/core";
import { PatientModule } from "./patient/patient.module";
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Patient]),
    PatientModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "defaultSecret",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    Reflector,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
