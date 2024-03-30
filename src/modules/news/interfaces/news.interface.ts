import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';
import { News } from '../entities/news.entity';

export type INewsRepository = BaseRepositoryInterface<News>;
