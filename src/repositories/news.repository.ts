import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { News, NewsDocument } from '@modules/news/entities/news.entity';
import { INewsRepository } from '@modules/news/interfaces/news.interface';

@Injectable()
export class NewsRepository
  extends BaseRepositoryAbstract<NewsDocument>
  implements INewsRepository
{
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<NewsDocument>,
  ) {
    super(newsModel);
  }
}
