import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilmDto, FilmDocument, ScheduleDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @Inject('FILM_MODEL')
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    return this.filmModel.find({}, { _id: 0, schedule: 0 }).lean<FilmDto[]>();
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { _id: 0, schedule: 1 })
      .lean<Pick<FilmDocument, 'schedule'>>();
    return film?.schedule ?? [];
  }

  async findOne(filmId: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id: filmId }).lean<FilmDocument>();
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
