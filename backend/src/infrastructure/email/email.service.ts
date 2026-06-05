import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST', 'localhost'),
      port: parseInt(config.get('SMTP_PORT', '587'), 10),
      secure: config.get('SMTP_SECURE', 'false') === 'true',
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASS'),
      },
    });
  }

  async sendByTemplate(
    templateCode: string,
    to: string,
    variables: Record<string, string>,
  ) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { code: templateCode },
    });
    if (!template || !template.isActive) return;

    let subject = template.subject;
    let body = template.body;
    for (const [key, value] of Object.entries(variables)) {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM', 'hr@company.com'),
      to,
      subject,
      text: body,
    });
  }

  async send(to: string, subject: string, body: string) {
    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM', 'hr@company.com'),
      to,
      subject,
      text: body,
    });
  }
}
