import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema({
  collection: 'thegioi_news',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class News extends BaseEntity {
  @Prop({
    required: true,
  })
  original_id: string;

  @Prop({
    required: true,
  })
  original_url: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  author: string;

  @Prop({
    required: true,
  })
  avatar: string;

  @Prop({
    required: true,
  })
  avatar_desc: string;

  @Prop({
    required: true,
  })
  sapo: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  scraped_time: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);

export const NewsSchemaFactory = () => {
  const news_schema = NewsSchema;

  return news_schema;
};
