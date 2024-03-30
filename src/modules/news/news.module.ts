import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { NewsRepository } from '@repositories/news.repository';
import { News, NewsSchema } from './entities/news.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [
    NewsService,
    {
      provide: 'INewsRepository',
      useClass: NewsRepository,
    },
  ],
  exports: [NewsService],
})
export class NewsModule {}
