import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import appConfig from './app.config.provider';
import { DatabaseModule } from './database/database.module';
import { AppRepository, FilmsRepository } from './repository/films.repository';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    DatabaseModule,
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    AppRepository,
    { provide: FilmsRepository, useExisting: AppRepository },
    FilmsService,
    OrderService,
  ],
})
export class AppModule {}
