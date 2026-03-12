import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';
import { FilmData, FilmsRepository } from './films.repository';

function toScheduleDto(schedule: ScheduleEntity): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime.toISOString(),
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: [...(schedule.taken || [])],
  };
}

@Injectable()
export class PostgresFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();
    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: [...(film.tags || [])],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    const exists = await this.filmRepository.exists({ where: { id: filmId } });
    if (!exists) return null;

    const schedules = await this.scheduleRepository.find({
      where: { filmId },
      order: { daytime: 'ASC' },
    });

    return schedules.map(toScheduleDto);
  }

  async findByIds(filmIds: string[]): Promise<FilmData[]> {
    if (filmIds.length === 0) return [];

    const films = await this.filmRepository.find({
      where: { id: In(filmIds) },
      relations: { schedule: true },
    });

    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: [...(film.tags || [])],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: (film.schedule || [])
        .slice()
        .sort((a, b) => a.daytime.getTime() - b.daytime.getTime())
        .map(toScheduleDto),
    }));
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    if (seats.length === 0) return;

    const updatedRows: Array<{ id: string }> =
      await this.scheduleRepository.query(
        `
        UPDATE schedules
        SET taken = array_cat(taken, $1::text[])
        WHERE film_id = $2
          AND id = $3
          AND NOT (taken && $1::text[])
        RETURNING id
      `,
        [seats, filmId, sessionId],
      );

    if (updatedRows.length === 0) {
      throw new BadRequestException('Места уже заняты');
    }
  }
}
