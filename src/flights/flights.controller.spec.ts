import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

import { Flight } from './types';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('FlightsController', () => {
  let controller: FlightsController;
  let service: FlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [
        {
          provide: FlightsService,
          useValue: {
            getFlights: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
    service = module.get<FlightsService>(FlightsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFlights', () => {
    it('should return an array of flights', async () => {
      const flights: Flight[] = [
        {
          slices: [
            {
              origin_name: 'Schonefeld',
              destination_name: 'Stansted',
              departure_date_time_utc: '2019-08-08T04:30:00.000Z',
              arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
              flight_number: '144',
              duration: 115,
            },
            {
              origin_name: 'Stansted',
              destination_name: 'Schonefeld',
              departure_date_time_utc: '2019-08-10T05:35:00.000Z',
              arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
              flight_number: '8542',
              duration: 120,
            },
          ],
          price: 129,
        },
      ];
      jest.spyOn(service, 'getFlights').mockResolvedValue(flights);

      const result = await controller.getFlights();

      expect(result).toEqual(flights);
    });

    it('should throw Internal Server Error if service throws an error', async () => {
      jest
        .spyOn(service, 'getFlights')
        .mockRejectedValue(new Error('Service error'));

      try {
        await controller.getFlights();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Service error');
        expect(error.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
