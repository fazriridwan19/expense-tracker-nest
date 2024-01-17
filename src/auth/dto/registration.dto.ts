import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
