import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/films.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    return this.filmModel.find({}, { _id: 0, schedule: 0 }).lean<FilmDto[]>();
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { _id: 0, schedule: 1 })
      .lean<Pick<Film, 'schedule'>>();
    if (!film) return null;
    return film.schedule;
  }

  async findByIds(filmIds: string[]): Promise<Film[]> {
    return this.filmModel.find({ id: { $in: filmIds } }).lean<Film[]>();
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $push: { 'schedule.$.taken': { $each: seats } } },
    );
  }
}
