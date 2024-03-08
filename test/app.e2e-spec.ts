import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { config } from 'dotenv';
import { AppModule } from './../src/app.module';
import { SearchService } from './../src/search/search.service';

config({ path: '.env.test' });

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  const searchServiceMock = {
    getFlights: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SearchService)
      .useValue(searchServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/search (GET)', async () => {
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

    searchServiceMock.getFlights.mockResolvedValue(mockFlightData);
    const response = await request(app.getHttpServer())
      .get('/search')
      .expect(200);

    expect(response.body).toEqual(mockFlightData);
  });

  it('/search (GET) - should throw 500 if SearchService failed to get the data', async () => {
    searchServiceMock.getFlights.mockRejectedValue(
      new Error('Internal Server Error'),
    );

    await request(app.getHttpServer()).get('/search').expect(500);
  });
});
