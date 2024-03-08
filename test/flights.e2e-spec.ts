import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { config } from 'dotenv';
import { AppModule } from './../src/app.module';
import { FlightsService } from './../src/flights/flights.service';

config({ path: '.env.test' });

describe('FlighsModule (e2e)', () => {
  let app: INestApplication;
  const flightsServiceMock = {
    getFlights: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FlightsService)
      .useValue(flightsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/flights (GET) - should return 200', async () => {
    const mockFlightData = [
      {
        slices: {
          origin_name: 'test',
          destination_name: 'test',
          departure_date_time_utc: 'test',
          arrival_date_time_utc: 'test',
          flight_number: 'test',
          duration: 12,
        },
        price: 100,
      },
    ];

    flightsServiceMock.getFlights.mockResolvedValue(mockFlightData);
    const response = await request(app.getHttpServer())
      .get('/flights')
      .expect(200);

    expect(response.body).toEqual(mockFlightData);
  });

  it('/flights (GET) - should throw 500 if flightsService failed to get the data', async () => {
    flightsServiceMock.getFlights.mockRejectedValue(
      new Error('Internal Server Error'),
    );

    await request(app.getHttpServer()).get('/flights').expect(500);
  });
});
