import { PopulateOptions } from 'mongoose';
import { filterDto, projectionDto } from 'src/pagination/pagination.dto';
import { FindAllResponse } from 'src/types/common.type';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
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
  findOne(id: string): Promise<T>;
  findOneByCondition(filter: Partial<T>): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
