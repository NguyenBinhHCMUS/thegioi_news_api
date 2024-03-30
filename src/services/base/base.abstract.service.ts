import { BaseEntity } from '@modules/shared/base/base.entity';
import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';
import { FindAllResponse } from 'src/types/common.type';
import { BaseServiceInterface } from './base.interface.service';
import { filterDto, projectionDto } from 'src/pagination/pagination.dto';
import { PopulateOptions } from 'mongoose';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(create_dto: T | any): Promise<T> {
    return await this.repository.create(create_dto);
  }

  async findAll(
    skip: number,
    limit: number,
    start_key?,
    sort_field?: string,
    sort_order?: number,
    filter?: filterDto[],
    projection?: projectionDto[],
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse> {
    const paging = await this.repository.findAll(
      skip,
      limit,
      start_key,
      sort_field,
      sort_order,
      filter,
      projection,
      populate,
    );

    return {
      docs: paging.docs?.map((doc) => doc.toJSON()),
      next_key: paging.next_key?.map(
        (doc) => new Object({ key: doc['key'], value: doc?.value?.toString() }),
      ),
      totalDocs: paging.totalDocs,
    };
  }
  async findOne(id: string) {
    return await this.repository.findOneById(id);
  }

  async findOneByCondition(filter: Partial<T>) {
    return await this.repository.findOneByCondition(filter);
  }

  async findMany(filter: Partial<T>) {
    return await this.repository.findMany(filter);
  }

  async update(id: string, update_dto: Partial<T>) {
    return await this.repository.update(id, update_dto);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }

  async countWithCondition(filter: Partial<T>) {
    return await this.repository.countByCondition(filter);
  }
}
