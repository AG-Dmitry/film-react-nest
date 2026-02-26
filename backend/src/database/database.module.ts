import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) =>
        mongoose.connect(configService.get<string>('DATABASE_URL')),
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
