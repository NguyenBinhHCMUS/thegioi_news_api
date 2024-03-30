import { PopulateOptions } from 'mongoose';
import { filterDto, projectionDto } from 'src/pagination/pagination.dto';
import { FindAllResponse } from 'src/types/common.type';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(id: string, projection?: string, option?: object): Promise<T>;

  findOneByCondition(condition?: object, projection?: string): Promise<T>;

  findAll(
    skip: number,
    limit: number,
    start_key?,
    sort_field?: string,
    sort_order?: number,
    filter?: filterDto[],
    projection?: projectionDto[],
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse>;

  findMany(condition?: object): Promise<Array<T>>;

  update(id: string, dto: Partial<T>): Promise<T>;

  updateMany(condition: object, dto: Partial<T>): Promise<number>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;

  countByCondition(condition?: object): Promise<number>;
}
