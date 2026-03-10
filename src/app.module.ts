import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionModule } from './permission/permission.module';
import { RolesModule } from './roles/roles.module';
import MongooseDelete from 'mongoose-delete';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('URL'),
      connectionFactory: (connection) => {
        // Cấu hình để tự động lọc bỏ các bản ghi đã xóa (isDeleted: true)
        connection.plugin(MongooseDelete, {
          overrideMethods: 'all',
          deletedAt: true,
        });
        return connection;
      }
    }),
    inject: [ConfigService],
  }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    JobsModule,
    FilesModule,
    ResumesModule,
    ResumesModule,
    PermissionModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
