import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export { UserResponseDto };

export class AuthResponseDto {
    @ApiProperty({ description: 'JWT access token (15 min expiry)' })
    accessToken: string;

    @ApiProperty({ description: 'JWT refresh token (7 day expiry)' })
    refreshToken: string;

    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto;
}

export class MessageResponseDto {
    @ApiProperty({ example: 'Operation completed successfully' })
    message: string;
}
