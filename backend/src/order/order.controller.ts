import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiListResponseDto } from '../common/api-list-response.dto';
import { CreateOrderDto, TicketResponseDto } from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ApiListResponseDto<TicketResponseDto>> {
    return this.orderService.create(createOrderDto);
  }
}
