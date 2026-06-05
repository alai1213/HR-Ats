import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackResult, SuggestedLevel } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsUUID()
  interviewId: string;

  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  technicalScore?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  communicationScore?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  projectScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overallComment?: string;

  @ApiPropertyOptional({ enum: FeedbackResult })
  @IsOptional()
  @IsEnum(FeedbackResult)
  result?: FeedbackResult;

  @ApiPropertyOptional({ enum: SuggestedLevel })
  @IsOptional()
  @IsEnum(SuggestedLevel)
  suggestedLevel?: SuggestedLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detailComment?: string;
}

export class InviteFeedbackDto {
  @ApiProperty()
  @IsUUID()
  interviewId: string;

  @ApiProperty()
  @IsUUID()
  interviewerId: string;
}
