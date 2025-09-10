import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { LoggingInterceptor } from "./common/logging.interceptor";
import { ResponseInterceptor } from "./common/response.interceptor";
import * as express from "express";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  try {
    // Create a temporary DataSource to test DB connection
    const dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    await dataSource.initialize();
    console.log("Database connection successful!");
    await dataSource.destroy();
  } catch (error) {
    console.error(" Database connection failed:", error.message);
  }

  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable JSON + URL-encoded parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error on unknown props
      transform: true, // auto-transform payloads to DTO class
    })
  );

  // Global interceptors (logging + response wrapper)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor()
  );

  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
