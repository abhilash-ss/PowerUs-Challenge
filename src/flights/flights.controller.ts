import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

import { FlightsService } from './flights.service';
import { Flight } from './types';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async getFlights(): Promise<Flight[]> {
    try {
      const flights = await this.flightsService.getFlights();
      return flights;
    } catch (error) {
      console.log('Failed to get Flights::Controller', { error });
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
