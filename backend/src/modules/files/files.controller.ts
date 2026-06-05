import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permissions } from '@/common/decorators/roles.decorator';

@ApiTags('文件管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('resume')
  @Permissions('candidate:write')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传并解析简历' })
  uploadResume(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadResume(file);
  }

  @Post('resume/:candidateId')
  @Permissions('candidate:write')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '为候选人上传简历并自动填充' })
  uploadCandidateResume(
    @Param('candidateId') candidateId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.uploadResume(file, candidateId);
  }

  @Post('attachment/:candidateId')
  @Permissions('candidate:write')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传候选人附件' })
  uploadAttachment(
    @Param('candidateId') candidateId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.uploadAttachment(file, candidateId);
  }

  @Post('reparse/:candidateId')
  @Permissions('candidate:write')
  @ApiOperation({ summary: '重新解析简历' })
  reparse(@Param('candidateId') candidateId: string) {
    return this.filesService.reparseResume(candidateId);
  }
}
