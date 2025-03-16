/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,  
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.validateUser(createUserDto.email, createUserDto.password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = await this.authService.login(user);

    return {
      message: 'Login successful',
      access_token: token.access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture ? `${user.profilePicture}` : null
      }
    };
  }
}
