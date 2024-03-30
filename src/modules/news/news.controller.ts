import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';

import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { FetchNews } from './dto/fetch-news.dto';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';

@Controller('news')
@ApiTags('news')
@UseInterceptors(MongooseClassSerializerInterceptor(News))
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('/search')
  findAll(@Body() query: FetchNews) {
    return this.newsService.findAll(
      query.skip,
      query.limit,
      query?.start_key,
      query?.sort?.field,
      query?.sort?.order,
      query?.filter,
      query?.projection,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }
}
