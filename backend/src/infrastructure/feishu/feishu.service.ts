import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CreateCalendarEventParams {
  summary: string;
  startTime: Date;
  endTime: Date;
  attendeeEmails: string[];
  description?: string;
}

@Injectable()
export class FeishuService {
  private appId: string;
  private appSecret: string;
  private tenantAccessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(private config: ConfigService) {
    this.appId = config.get('FEISHU_APP_ID', '');
    this.appSecret = config.get('FEISHU_APP_SECRET', '');
  }

  private async getTenantAccessToken(): Promise<string> {
    if (this.tenantAccessToken && Date.now() < this.tokenExpiresAt) {
      return this.tenantAccessToken;
    }

    const res = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: this.appId, app_secret: this.appSecret }),
      },
    );
    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(`飞书认证失败: ${data.msg}`);
    }

    this.tenantAccessToken = data.tenant_access_token;
    this.tokenExpiresAt = Date.now() + (data.expire - 60) * 1000;
    return this.tenantAccessToken!;
  }

  async createCalendarEvent(params: CreateCalendarEventParams) {
    if (!this.appId || !this.appSecret) {
      return {
        eventId: `mock-${Date.now()}`,
        calendarLink: 'https://feishu.cn/mock-calendar-event',
      };
    }

    const token = await this.getTenantAccessToken();
    const res = await fetch(
      'https://open.feishu.cn/open-apis/calendar/v4/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: params.summary,
          description: params.description,
          start_time: { timestamp: Math.floor(params.startTime.getTime() / 1000) },
          end_time: { timestamp: Math.floor(params.endTime.getTime() / 1000) },
          attendees: params.attendeeEmails.map((email) => ({ email })),
        }),
      },
    );

    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(`飞书日历创建失败: ${data.msg}`);
    }

    return {
      eventId: data.data?.event?.event_id || data.data?.event_id,
      calendarLink: data.data?.event?.app_link || data.data?.app_link,
    };
  }
}
