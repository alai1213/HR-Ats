import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { ApproveOfferDto, CreateOfferDto } from './dto/offer.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Offer审批')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  @Permissions('offer:approve', 'candidate:read:all')
  @ApiOperation({ summary: '获取Offer审批列表' })
  findAll() {
    return this.offersService.findAll();
  }

  @Get('candidate/:candidateId')
  @Permissions('offer:approve', 'candidate:read:all')
  @ApiOperation({ summary: '获取候选人Offer审批记录' })
  findByCandidate(@Param('candidateId') candidateId: string) {
    return this.offersService.findByCandidate(candidateId);
  }

  @Post()
  @Permissions('offer:approve')
  @ApiOperation({ summary: '提交Offer审批' })
  create(@Body() dto: CreateOfferDto, @CurrentUser() user: AuthUser) {
    return this.offersService.create(dto, user.id);
  }

  @Patch(':id/approve')
  @Permissions('offer:approve')
  @ApiOperation({ summary: '审批Offer' })
  approve(
    @Param('id') id: string,
    @Body() dto: ApproveOfferDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.offersService.approve(id, dto, user.id);
  }
}
