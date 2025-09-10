import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";

/**
 * AuthService handles authentication logic such as validating users and issuing JWT tokens.
 */
@Injectable()
export class AuthService {
  /**
   * Injects UserService for user lookup and JwtService for token generation.
   */
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Validates a user's credentials.
   * @param email User's email
   * @param password User's password
   * @returns User object without password if valid, throws UnauthorizedException otherwise
   */
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        // Remove password before returning user object
        const { password, ...result } = user;
        return result;
      } else {
        return null;
      }
    } catch (error) {
      throw new UnauthorizedException(error.message || "Validation failed");
    }
  }

  /**
   * Issues a JWT token for an authenticated user.
   * @param user Authenticated user object
   * @returns Object containing access_token
   */
  async login(user: any) {
    try {
      const payload = { email: user.email, role: user.role, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      return { message: error.message || "Login failed" };
    }
  }
}
