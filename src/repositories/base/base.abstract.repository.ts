import { BaseEntity } from '@modules/shared/base/base.entity';
import { Model, PopulateOptions, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';
import { paginate } from 'src/paginate';
import { filterDto, projectionDto } from 'src/pagination/pagination.dto';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create(dto);
    return created_data.save();
  }

  async findOneById(
    id: string,
    projection?: string,
    options?: QueryOptions<T>,
  ): Promise<T> {
    const item = await this.model.findById(id, projection, options);
    return item ? item : null;
  }

  async findOneByCondition(condition = {}): Promise<T> {
    return await this.model
      .findOne({
        ...condition,
        deleted_at: null,
      })
      .exec();
  }

  async findMany(condition = {}): Promise<Array<T>> {
    return await this.model
      .find({
        ...condition,
        deleted_at: null,
      })
      .exec();
  }

  async findAll(
    skip = 0,
    limit = 10,
    start_key?,
    sort_field?: string,
    sort_order?: number,
    filter?: filterDto[],
    projection?: projectionDto[],
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse> {
    return await paginate(
      this.model,
      skip,
      limit,
      start_key,
      sort_field,
      sort_order,
      filter,
      projection,
      populate,
    );
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    await this.model
      .updateOne({ _id: id, deleted_at: null }, dto, { new: true })
      .exec();
    return await this.model.findById(id).exec();
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { deleted_at: new Date(), status: 'HIDE' })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findOneAndDelete({ _id: id }));
  }

  async updateMany(condition = {}, dto: Partial<T>): Promise<number> {
    return (await this.model.updateMany(condition, dto, { new: true }).exec())
      .matchedCount;
  }

  async countByCondition(condition = {}): Promise<number> {
    return await this.model.countDocuments(condition).exec();
  }
}
