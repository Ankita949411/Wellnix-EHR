import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-dto";

/**
 * UserService handles all user-related database operations and business logic.
 */
@Injectable()
export class UserService {
  /**
   * Injects the User repository for database access.
   */
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  /**
   * Returns all users in the database.
   */
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * Returns paginated users with search functionality
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    // Ensure valid integers
    const validPage = Math.max(1, Math.floor(Number(page)) || 1);
    const validLimit = Math.max(
      1,
      Math.min(100, Math.floor(Number(limit)) || 10)
    );
    const offset = (validPage - 1) * validLimit;

    const queryBuilder = this.userRepo
      .createQueryBuilder("user")
      .where("user.isActive = :isActive", { isActive: true });

    if (search && search.trim()) {
      queryBuilder.andWhere(
        "(user.firstName ILIKE :search OR user.lastName ILIKE :search)",
        { search: `%${search.trim()}%` }
      );
    }

    const [users, total] = await queryBuilder
      .skip(offset)
      .take(validLimit)
      .orderBy("user.createdAt", "DESC")
      .getManyAndCount();

    return {
      users,
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  /**
   * Finds a user by their ID.
   * @param id User's ID
   */
  async findOne(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  /**
   * Creates a new user from a partial User object, hashes password if present.
   * @param user Partial user data
   */
  async create(user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  /**
   * Soft deletes a user by setting isActive to false.
   * @param id User's ID
   */
  async remove(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    user.isActive = false;
    return this.userRepo.save(user);
  }

  /**
   * Updates a user by ID
   * @param id User's ID
   * @param updateData Partial user data to update
   */
  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  /**
   * Creates a new user with explicit fields, hashes password.
   * @param email User's email
   * @param password User's password
   * @param name User's name
   * @param role User's role
   */
  async createUser(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      department,
      licenseNumber,
    } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      department,
      licenseNumber,
    });
    return this.userRepo.save(user);
  }

  /**
   * Finds a user by their email address.
   * @param email User's email
   */
  async findByEmail(email: string) {
    try {
      return this.userRepo.findOne({ where: { email } });
    } catch (error) {
      throw new Error(error.message || "User not found");
    }
  }
}
