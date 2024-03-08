import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';

@Module({
  imports: [CacheModule.register()],
  providers: [FlightsService],
  controllers: [FlightsController],
})
export class FlightsModule {}
