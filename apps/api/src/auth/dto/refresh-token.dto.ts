import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token from previous login or refresh',
    example: 'a1b2c3d4e5f6789abcdef0123456789...',
  })
  @IsString()
  @MinLength(1, { message: 'Refresh token is required' })
  refreshToken!: string;
}
