import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Flight, FlightsData } from './types';

@Injectable()
export class SearchService {
  private readonly baseURL = 'https://coding-challenge.powerus.de/flight/';

  private readonly sources = ['source1', 'source2'];

  async getFlights(): Promise<Flight[]> {
    try {
      const responses = await Promise.all(
        this.sources.map(async (source) => {
          try {
            const res = await axios.get<FlightsData>(
              `${this.baseURL}${source}`,
            );
            return res.data.flights;
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
