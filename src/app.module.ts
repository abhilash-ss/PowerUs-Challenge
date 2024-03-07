import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController, SearchController],
  providers: [AppService, SearchService],
})
export class AppModule {}
