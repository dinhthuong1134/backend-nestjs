import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schemas/jobs.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Jobs.name, schema: JobsSchema },
      ]),
    ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {}
