export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class TicketResponseDto extends TicketDto {
  id: string;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}
