import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination/pagination.dto';

export class FetchNews extends PartialType(PaginationDto) {}
