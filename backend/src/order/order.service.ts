import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ApiListResponseDto } from '../common/api-list-response.dto';
import { CreateOrderDto, TicketResponseDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { Film } from '../films/films.schema';

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = map.get(key);
    if (group) group.push(item);
    else map.set(key, [item]);
  }
  return map;
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<ApiListResponseDto<TicketResponseDto>> {
    const { tickets } = createOrderDto;

    const seatKeys = tickets.map(
      (t) => `${t.film}:${t.session}:${t.row}:${t.seat}`,
    );
    if (new Set(seatKeys).size !== seatKeys.length) {
      throw new BadRequestException('В заказе есть дублирующиеся места');
    }

    const filmIds = [...new Set(tickets.map((t) => t.film))];
    const films = await this.filmsRepository.findByIds(filmIds);
    const filmMap = new Map<string, Film>(films.map((f) => [f.id, f]));

    const ticketsByFilm = groupBy(tickets, (t) => t.film);

    for (const [filmId, filmTickets] of ticketsByFilm) {
      const film = filmMap.get(filmId);
      if (!film) {
        throw new BadRequestException(`Фильм ${filmId} не найден`);
      }

      const ticketsBySession = groupBy(filmTickets, (t) => t.session);

      for (const [sessionId, sessionTickets] of ticketsBySession) {
        const schedule = film.schedule?.find((s) => s.id === sessionId);
        if (!schedule) {
          throw new BadRequestException(`Сеанс ${sessionId} не найден`);
        }

        const newSeats = sessionTickets.map((t) => `${t.row}:${t.seat}`);
        const alreadyTaken = newSeats.filter((seat) =>
          schedule.taken.includes(seat),
        );
        if (alreadyTaken.length > 0) {
          throw new BadRequestException(
            `Места уже заняты: ${alreadyTaken.join(', ')}`,
          );
        }

        await this.filmsRepository.addTakenSeats(filmId, sessionId, newSeats);
      }
    }

    const items: TicketResponseDto[] = tickets.map((ticket) => ({
      id: randomUUID(),
      ...ticket,
    }));

    return { total: items.length, items };
  }
}
