import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123',
  })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string;

  @ApiProperty({
    description: 'Tenant ID (country/region)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Invalid tenant ID' })
  tenantId!: string;
}
