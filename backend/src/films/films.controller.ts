import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ApiListResponseDto } from '../common/api-list-response.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(): Promise<ApiListResponseDto<FilmDto>> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findSchedule(
    @Param('id') id: string,
  ): Promise<ApiListResponseDto<ScheduleDto>> {
    return this.filmsService.findSchedule(id);
  }
}
