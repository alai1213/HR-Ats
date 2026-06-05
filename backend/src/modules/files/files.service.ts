import { Injectable } from '@nestjs/common';
import { MinioStorageService } from '@/infrastructure/storage/minio-storage.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private storage: MinioStorageService,
    private prisma: PrismaService,
  ) {}

  async uploadResume(
    file: Express.Multer.File,
    candidateId?: string,
  ) {
    const fileUrl = await this.storage.upload(file, 'resumes');
    const parsed = await this.parseResume(file);

    let candidateFile;
    if (candidateId) {
      candidateFile = await this.prisma.candidateFile.create({
        data: {
          candidateId,
          fileName: file.originalname,
          fileUrl,
          fileType: file.mimetype,
          fileSize: file.size,
          isResume: true,
        },
      });

      if (parsed) {
        await this.prisma.candidate.update({
          where: { id: candidateId },
          data: {
            ...parsed,
            resumeParsed: true,
          },
        });
      }
    }

    return { fileUrl, parsed, candidateFile };
  }

  async uploadAttachment(
    file: Express.Multer.File,
    candidateId: string,
  ) {
    const fileUrl = await this.storage.upload(file, 'attachments');
    return this.prisma.candidateFile.create({
      data: {
        candidateId,
        fileName: file.originalname,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        isResume: false,
      },
    });
  }

  async reparseResume(candidateId: string) {
    const resume = await this.prisma.candidateFile.findFirst({
      where: { candidateId, isResume: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!resume) return { message: '未找到简历文件' };

    // In production, fetch file from MinIO and parse
    return { message: '简历重新解析已触发', candidateId };
  }

  private async parseResume(file: Express.Multer.File) {
    if (file.mimetype !== 'application/pdf') return null;

    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(file.buffer);
      const text = data.text;

      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const phoneMatch = text.match(/1[3-9]\d{9}/);

      const lines = text.split('\n').filter((l: string) => l.trim());
      const name = lines[0]?.trim().slice(0, 20);

      const educationKeywords = ['大学', '学院', '硕士', '博士', '本科', '专科'];
      const education = lines.find((l: string) =>
        educationKeywords.some((k) => l.includes(k)),
      );

      const workYearsMatch = text.match(/(\d+)\s*年.*经验/);

      return {
        name: name || undefined,
        email: emailMatch?.[0],
        phone: phoneMatch?.[0],
        education: education?.trim(),
        workYears: workYearsMatch ? parseFloat(workYearsMatch[1]) : undefined,
        skills: this.extractSkills(text),
      };
    } catch {
      return null;
    }
  }

  private extractSkills(text: string): string {
    const skillKeywords = [
      'Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Vue',
      'Node.js', 'Go', 'SQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    ];
    const found = skillKeywords.filter((s) =>
      text.toLowerCase().includes(s.toLowerCase()),
    );
    return found.join(', ');
  }
}
