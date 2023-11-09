import {
  Controller,
  Get,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './schema/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './schema/login-user.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { AuthGuard } from './guard/user.guard';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/all')
  async findAllUser(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post('/register')
  async register(
    @Body() body: CreateUserDto,
  ): Promise<{ code: number; message: string }> {
    const hasedPassword = await bcrypt.hash(body.password, 11);
    const user = {
      ...body,
      password: hasedPassword,
    };
    await this.userService.create(user);
    return {
      code: 200,
      message: 'Registed!',
    };
  }

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(body.email);
    const { password } = user;
    const isCorrect = await bcrypt.compare(body.password, password);
    if (isCorrect) {
      const token = await this.jwtService.signAsync({ id: user._id });
      return {
        token,
      };
    } else {
      throw new HttpException('Sai mật khẩu!', HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Request() req: any) {
    const { id } = req.user;
    const user = await this.userService.findById(id);
    this.userService.userTransferObject(user);
    return user;
  }
}
