import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PositionPriority, PositionStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePositionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  headcount: number;

  @ApiProperty()
  @IsUUID()
  ownerId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ enum: PositionPriority })
  @IsOptional()
  @IsEnum(PositionPriority)
  priority?: PositionPriority;

  @ApiPropertyOptional({ enum: PositionStatus })
  @IsOptional()
  @IsEnum(PositionStatus)
  status?: PositionStatus;
}

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}

export class QueryPositionDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ enum: PositionStatus })
  @IsOptional()
  @IsEnum(PositionStatus)
  status?: PositionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
