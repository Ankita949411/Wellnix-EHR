// backend/src/user/user.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  HttpStatus,
  Query,
  Delete,
  Patch,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { IUser } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/create-dto";

import { RolesGuard } from "./roles.guard";
import { Roles } from "./roles.decorator";
import { UserRole } from "./user.enums";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ResponseInterceptor } from "../common/response.interceptor";
import { UserListDto } from "./dto/user-list.dto";

@Controller("users")
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Create new user (only ADMIN can create users)
  @Post("create")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    try {
      if (!createUserDto) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Invalid user data",
        };
      }
      const saveData = await this.userService.createUser(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: "User created successfully",
        data: saveData,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  //Get user by ID
  @Get(":id")
  async getUserById(@Param("id") id: number, @Request() req) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: "User retrieved successfully",
        data: user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  //Get all users with pagination and search (only ADMIN can access)
  @Post("list")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getAllUsers(@Query() query: UserListDto, @Request() req) {
    try {
      const page = Math.max(1, query.page || 1);
      const limit = Math.max(1, Math.min(100, query.limit || 10));
      const search = query.search?.trim() || undefined;

      console.log("Processed params:", { page, limit, search });

      const result = await this.userService.findAllPaginated(
        page,
        limit,
        search
      );

      return {
        statusCode: HttpStatus.OK,
        message: "Users retrieved successfully",
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  //Delete user by ID (only ADMIN can delete users)
  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async deleteUser(@Param("id") id: number, @Request() req) {
    try {
      const user = await this.userService.remove(id);
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: "User deactivated successfully",
        data: user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Patch(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: Partial<IUser>,
    @Request() req
  ) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
        };
      }
      const updatedUser = await this.userService.update(id, updateUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: "User updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
