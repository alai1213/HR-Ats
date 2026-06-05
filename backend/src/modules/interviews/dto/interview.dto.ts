import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterviewMode, InterviewRound } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiProperty({ enum: InterviewRound })
  @IsEnum(InterviewRound)
  round: InterviewRound;

  @ApiProperty()
  @IsDateString()
  scheduledAt: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty()
  @IsUUID()
  interviewerId: string;

  @ApiPropertyOptional({ enum: InterviewMode })
  @IsOptional()
  @IsEnum(InterviewMode)
  mode?: InterviewMode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: '是否同步飞书日历' })
  @IsOptional()
  syncFeishu?: boolean;
}

export class QueryInterviewDto {
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
  @IsUUID()
  candidateId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  interviewerId?: string;
}
