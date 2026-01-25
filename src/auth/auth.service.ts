import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.isUser(username);
        if(user){
            const checkPassWord = await this.usersService.isPassWord(pass, user.password);
            if(checkPassWord){
                return user;
            }
        }
        return null;
    }
}
