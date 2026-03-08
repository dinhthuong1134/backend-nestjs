import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import ms from "ms";
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.isUser(username);
        if (user) {
            const checkPassWord = await this.usersService.isPassWord(pass, user.password);
            if (checkPassWord === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const payload = {
            sub: 'token login',
            iss: 'dinhthuong',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateToken(refreshToken, user._id);
        response.cookie('refreshToken', refreshToken, {
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue),
            httpOnly: true
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async register(data: RegisterUserDto) {
        return await this.usersService.register(data);
    }

    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRE")
        });
        return refreshToken;
    }

    async processNewToken(refreshToken: string, response: Response) {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN")
            })

            let user = await this.usersService.findUserByRefreshToken(refreshToken);
            if (user) {
                const payload = {
                    sub: 'token refresh',
                    iss: 'dinhthuong',
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
                const refreshToken = this.createRefreshToken(payload);
                await this.usersService.updateToken(refreshToken, user._id.toString());
                response.clearCookie('refreshToken');
                response.cookie('refreshToken', refreshToken, {
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue),
                    httpOnly: true
                })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                };
            }
            else {
                throw new BadRequestException("refresh token đã hết hạn vui long đăng nhập lại");
            }

        } catch (error) {
            throw new BadRequestException("refresh token đã hết hạn vui long đăng nhập lại");
        }
    }

    async logout(user: IUser, response: Response){
        await this.usersService.updateToken(null, user._id);
        response.clearCookie('refreshToken');
        return "ok";
    }
}
