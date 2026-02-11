import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    schema: {
      example: {
        access_token: '<jwt>',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}

