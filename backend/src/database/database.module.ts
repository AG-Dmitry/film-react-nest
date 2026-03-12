import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../app.config.provider';
import { Film, FilmSchema } from '../films/films.schema';
import { FilmEntity, ScheduleEntity } from '../films/entities';
import {
  APP_REPOSITORY,
  MongoFilmsRepository,
  PostgresFilmsRepository,
} from '../repository';

const { database } = appConfig();
const databaseDriver = database.driver;
const isPostgresDriver = databaseDriver === 'postgres';

const databaseImports = isPostgresDriver
  ? [
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres' as const,
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          entities: [FilmEntity, ScheduleEntity],
          synchronize: true,
        }),
      }),
      TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
    ]
  : [
      MongooseModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>('database.url'),
        }),
        inject: [ConfigService],
      }),
      MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    ];

const repositoryProviders = isPostgresDriver
  ? [
      PostgresFilmsRepository,
      { provide: APP_REPOSITORY, useExisting: PostgresFilmsRepository },
    ]
  : [
      MongoFilmsRepository,
      { provide: APP_REPOSITORY, useExisting: MongoFilmsRepository },
    ];

@Module({
  imports: databaseImports,
  providers: repositoryProviders,
  exports: [APP_REPOSITORY],
})
export class DatabaseModule {}
