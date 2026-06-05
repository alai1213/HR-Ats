import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferApprovalStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ApproveOfferDto {
  @ApiProperty({ enum: OfferApprovalStatus })
  @IsEnum(OfferApprovalStatus)
  status: OfferApprovalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  approvalNotes?: string;
}
