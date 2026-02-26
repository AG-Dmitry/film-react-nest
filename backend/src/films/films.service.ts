import { Injectable } from '@nestjs/common';
import { ApiListResponseDto } from '../common/api-list-response.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<ApiListResponseDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  async findSchedule(id: string): Promise<ApiListResponseDto<ScheduleDto>> {
    const items = await this.filmsRepository.findSchedule(id);
    return { total: items.length, items };
  }
}
