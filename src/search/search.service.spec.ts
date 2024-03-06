import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import axios from 'axios';

jest.mock('axios');

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return unique flight list when successful', async () => {
    const mockResponse1 = {
      data: {
        flights: {
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
      },
    };

    const mockResponse2 = {
      data: {
        flights: {
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
      },
    };

    (axios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockResponse1),
    );
    (axios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockResponse2),
    );

    const result = await service.getFlights();

    expect(result).toEqual([
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
    ]);
  });

  it('should return empty array if API failed to fetch the flight details', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await service.getFlights();
    expect(result).toEqual([]);
  });

  it('should throw the error if flight details missing in the response or if any operations failed', async () => {
    const mockResponse1 = {
      data: {
        flights: {},
      },
    };

    const mockResponse2 = {
      data: {
        flights: {},
      },
    };

    (axios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockResponse1),
    );
    (axios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockResponse2),
    );

    await expect(service.getFlights()).rejects.toThrow();
  });
});
