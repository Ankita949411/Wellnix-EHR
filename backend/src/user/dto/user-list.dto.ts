import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UserListDto {
  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? 1 : num;
  })
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? 10 : num;
  })
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
