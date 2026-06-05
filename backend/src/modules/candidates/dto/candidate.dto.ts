import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CandidateSource, CandidateStage, Gender } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCandidateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wechat?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentCompany?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentPosition?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  workYears?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  school?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expectedSalary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  positionId?: string;

  @ApiPropertyOptional({ enum: CandidateSource })
  @IsOptional()
  @IsEnum(CandidateSource)
  source?: CandidateSource;

  @ApiPropertyOptional({ enum: CandidateStage })
  @IsOptional()
  @IsEnum(CandidateStage)
  stage?: CandidateStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hrNotes?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {}

export class QueryCandidateDto {
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
  @IsUUID()
  positionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ enum: CandidateStage })
  @IsOptional()
  @IsEnum(CandidateStage)
  stage?: CandidateStage;

  @ApiPropertyOptional({ enum: CandidateSource })
  @IsOptional()
  @IsEnum(CandidateSource)
  source?: CandidateSource;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdTo?: string;
}

export class BatchUpdateCandidateDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiPropertyOptional({ enum: CandidateStage })
  @IsOptional()
  @IsEnum(CandidateStage)
  stage?: CandidateStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}

export class UpdateStageDto {
  @ApiProperty({ enum: CandidateStage })
  @IsEnum(CandidateStage)
  stage: CandidateStage;
}
