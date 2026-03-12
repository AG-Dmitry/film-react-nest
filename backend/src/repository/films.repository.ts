import { Inject, Injectable } from '@nestjs/common';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface FilmSchedule {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmData extends FilmDto {
  schedule: FilmSchedule[];
}

// DI токен для выбора активного репозитория в зависимости от базы данных.
export const APP_REPOSITORY = Symbol('APP_REPOSITORY');

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(filmId: string): Promise<ScheduleDto[] | null>;
  abstract findByIds(filmIds: string[]): Promise<FilmData[]>;
  abstract addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void>;
}

@Injectable()
export class AppRepository extends FilmsRepository {
  constructor(
    @Inject(APP_REPOSITORY)
    private readonly repository: FilmsRepository,
  ) {
    super();
  }

  findAll(): Promise<FilmDto[]> {
    return this.repository.findAll();
  }

  findSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    return this.repository.findSchedule(filmId);
  }

  findByIds(filmIds: string[]): Promise<FilmData[]> {
    return this.repository.findByIds(filmIds);
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.repository.addTakenSeats(filmId, sessionId, seats);
  }
}
