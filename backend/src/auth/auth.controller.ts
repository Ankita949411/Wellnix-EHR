import { Controller, Post, Body, UseInterceptors, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ResponseInterceptor } from "../common/response.interceptor";
import { Public } from "./public.decorator";

/**
 * AuthController handles authentication-related API routes.
 * Route: /auth
 */
@Controller("auth")
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  /**
   * Injects AuthService for authentication logic.
   */
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login
   * Authenticates a user with email and password.
   * @param body LoginDto containing email and password
   * @returns JWT token and user info if successful
   */
  @Public()
  @Post("/login")
  async login(@Body() body: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        body?.email,
        body?.password
      );
      if (!user) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Invalid credentials",
        };
      }
      const token = await this.authService.login(user);
      return {
        statusCode: HttpStatus.OK,
        message: "Login successful",
        data: token,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
