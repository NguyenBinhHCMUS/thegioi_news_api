import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { News } from './entities/news.entity';
import { INewsRepository } from './interfaces/news.interface';

@Injectable()
export class NewsService extends BaseServiceAbstract<News> {
  constructor(
    @Inject('INewsRepository')
    private readonly newsRepository: INewsRepository,
  ) {
    super(newsRepository);
  }

  async findOneById(id: string) {
    return this.newsRepository.findOneByCondition({
      _id: id,
    });
  }
}
