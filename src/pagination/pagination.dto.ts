import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  ENUM_FILTER_OPERATOR_TYPE,
  REGEX_MONGO_FIELD_NAME,
  REGEX_SEARCH_MODE_TYPE,
  TYPE_MONGO_FIELD_NAME,
  TYPE_STRING_NUM_ARRAY,
} from '../types';
import { IsValidMongoFilterValue } from '../decorators/is-valid-mongo-filter-value';
import { IsMongoArrValue } from '../decorators/is-mongo-arr-value';
import { IsValidMongoSortOrderValue } from '../decorators/is-valid-mongo-sort-order-value';
import { IsValidMongoFieldName } from '../decorators/is-valid-mongo-field-name';
import { ApiPropertyOptional } from '@nestjs/swagger';
import moment from 'moment';
import { isAddress } from '@ethersproject/address';

export class sortDto {
  @IsString()
  @Matches(REGEX_MONGO_FIELD_NAME)
  @MinLength(2)
  @MaxLength(20)
  field;

  @IsValidMongoSortOrderValue()
  order: number;
}

export class filterDto {
  @IsValidMongoFieldName()
  name: TYPE_MONGO_FIELD_NAME;

  @IsValidMongoFilterValue()
  value;

  @ValidateIf(
    (object) =>
      object.operator ===
      (ENUM_FILTER_OPERATOR_TYPE._in || ENUM_FILTER_OPERATOR_TYPE._nin),
  )
  @IsMongoArrValue(100)
  arr_value: TYPE_STRING_NUM_ARRAY;

  @IsEnum(ENUM_FILTER_OPERATOR_TYPE)
  operator: ENUM_FILTER_OPERATOR_TYPE;

  @ValidateIf((object) => object.operator === 'regex')
  @IsEnum(REGEX_SEARCH_MODE_TYPE)
  mode: string;
}

export class projectionDto {
  @IsString()
  @Matches(REGEX_MONGO_FIELD_NAME)
  @MinLength(2)
  @MaxLength(20)
  name;

  @IsInt()
  @Min(0)
  @Max(1)
  mode;
}

export class startKeyDto {
  @IsString()
  @Matches(REGEX_MONGO_FIELD_NAME)
  @MinLength(2)
  @MaxLength(20)
  key;

  @IsValidMongoFilterValue()
  value;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => startKeyDto)
  @ValidateNested({
    each: true,
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ApiPropertyOptional({
    type: 'object[]',
    example:
      '[{"key": "_id","value": "61a4c444f9534392c70afaf6"},{"key": "score","value": 100}]',
  })
  start_key: startKeyDto[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ default: 0 })
  @Transform((raw) => +raw.value)
  skip: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 10 })
  @Transform((raw) => +raw.value)
  limit: number;

  @Type(() => sortDto)
  @ValidateNested()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'any',
    example: '{"field": "score","order": 1}',
  })
  sort: sortDto;

  @IsOptional()
  @Type(() => filterDto)
  @ValidateNested({
    each: true,
  })
  @ArrayMinSize(1)
  @ApiPropertyOptional({
    type: 'object[]',
    example:
      '[{"name":"score","value":400,"operator":"lt"},{"name":"isPassed","value":true,"operator":"eq"},{"name":["outer_field_name","inner_field_name"],"value":"user one","operator":"eq"},{"name":"time","arr_value":[40,60],"operator":"in"},{"name":"left_count","arr_value":[0,1],"operator":"nin"}]',
  })
  filter: filterDto[];

  @IsOptional()
  @Type(() => projectionDto)
  @ValidateNested({
    each: true,
  })
  @ApiPropertyOptional({
    type: 'object[]',
    example: '[{"name": "password","mode": 0}]',
  })
  projection: projectionDto[];
}

@ValidatorConstraint({ name: 'IsEVMAddress', async: false })
export class IsEVMAddress implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return isAddress(text); // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return '$(value) Not valid EVM address';
  }
}

@ValidatorConstraint({ name: 'IsEpoch', async: false })
export class IsEpoch implements ValidatorConstraintInterface {
  validate(epoch: number, args: ValidationArguments) {
    try {
      moment.unix(epoch);
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return '$(value) is not a valid epoch';
  }
}
