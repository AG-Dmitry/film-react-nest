import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { DatabaseModule } from './database/database.module';
import { FilmSchema } from './films/films.schema';
import { FilmsRepository } from './repository/films.repository';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    DatabaseModule,
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    {
      provide: 'FILM_MODEL',
      useFactory: (connection) => {
        return (
          connection.models['Film'] || connection.model('Film', FilmSchema)
        );
      },
      inject: ['DATABASE_CONNECTION'],
    },
    FilmsRepository,
    FilmsService,
    OrderService,
  ],
})
export class AppModule {}
