import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({
    description: 'User password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'SecurePass123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'First name is required' })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'Last name is required' })
  lastName!: string;

  @ApiProperty({
    description: 'Tenant ID (country/region)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Invalid tenant ID' })
  tenantId!: string;
}
