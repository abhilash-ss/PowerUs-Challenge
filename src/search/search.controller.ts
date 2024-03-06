import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

import { SearchService } from './search.service';
import { Flight } from './types';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async getFlights(): Promise<Flight[]> {
    try {
      const flights = await this.searchService.getFlights();
      return flights;
    } catch (error) {
      console.log('Failed to get Flights::Controller', { error });
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
