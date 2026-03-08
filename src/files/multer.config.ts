import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg', 
          'image/png', 
          'application/pdf', 
          'application/octet-stream' 
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true); // Chấp nhận file
        } else {
          cb(new Error(`Định dạng ${file.mimetype} không được hỗ trợ!`), false); // Từ chối file
        }
      },
      limits: {
        fileSize: 1 * 1024 * 1024, // 1Mb
      }
    };
  }
}