import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';

import { Flight, FlightsData } from './types';

@Injectable()
export class SearchService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private readonly baseURL = 'https://coding-challenge.powerus.de/flight/';

  private readonly sources = ['source1', 'source2'];

  async getFlights(): Promise<Flight[]> {
    try {
      const responses = await Promise.all(
        this.sources.map(async (source) => {
          try {
            const cacheResult = await this.cacheManager.get(source);
            let flights;
            if (!cacheResult) {
              const response = await axios.get<FlightsData>(
                `${this.baseURL}${source}`,
              );
              flights = response.data.flights;
              await this.cacheManager.set(source, flights, 1000 * 60 * 60);
            } else {
              flights = await this.cacheManager.get(source);
            }
            return flights;
          } catch (error) {
            return null;
          }
        }),
      );

      const mergedFlightList: Flight[] = [].concat(
        ...responses.filter(Boolean),
      );

      const flightWithUniqueKey = {};
      mergedFlightList.forEach((flight) => {
        const key = `${flight.slices.map((item) => item.flight_number)}-${flight.slices.map((item) => item.departure_date_time_utc)}-${flight.slices.map((item) => item.arrival_date_time_utc)}`;
        if (!flightWithUniqueKey[key]) {
          flightWithUniqueKey[key] = flight;
        }
      });

      const uniqueFlights: Flight[] = Object.keys(flightWithUniqueKey).map(
        (key) => flightWithUniqueKey[key],
      );

      return uniqueFlights;
    } catch (error) {
      console.log('Failed to get Flights::Service', { error });
      throw error;
    }
  }
}
