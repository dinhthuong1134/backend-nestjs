import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),MongooseModule.forRoot("mongodb://127.0.0.1:27018/phamdinhthuong"), UsersModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
