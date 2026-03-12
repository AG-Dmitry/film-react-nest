import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/films.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmData, FilmsRepository } from './films.repository';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {
    super();
  }

  findAll(): Promise<FilmDto[]> {
    return this.filmModel.find({}, { _id: 0, schedule: 0 }).lean<FilmDto[]>();
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { _id: 0, schedule: 1 })
      .lean<Pick<FilmData, 'schedule'>>();

    if (!film) return null;
    return film.schedule;
  }

  findByIds(filmIds: string[]): Promise<FilmData[]> {
    return this.filmModel.find({ id: { $in: filmIds } }).lean<FilmData[]>();
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
