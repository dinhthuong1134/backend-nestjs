import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/users/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import type { Response } from 'express';
import type { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public() 
  @UseGuards(LocalAuthGuard) 
  @Post('/login')
  @ResponseMessage("đăng nhập thành công")
  handleLogin(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @ResponseMessage("tạo mới người dùng thành công")
  @Post('register')
  handleRegister(@Body() createUser: RegisterUserDto ){
    return this.authService.register(createUser);
  }

  @ResponseMessage("Get user information")
  @Get('/account')
  handleGetAccount(@User() user: IUser){
    return {user};
  }

  @Public()
  @ResponseMessage("Get user by refresh tokem")
  @Get('/refresh')
  handleRefreshToken(@Req() req, @Res({ passthrough: true }) response: Response){
    const refreshToken = req.cookies["refreshToken"];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage("Logout thành công")
  @Post('/logout')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response){
    return this.authService.logout(user, response);
  }
}
