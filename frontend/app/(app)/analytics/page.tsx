'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  const { data: efficiency } = useQuery({
    queryKey: ['efficiency'],
    queryFn: () => api.get<any>('/dashboard/efficiency'),
  });

  const { data: channels } = useQuery({
    queryKey: ['channels'],
    queryFn: () => api.get<any[]>('/dashboard/channels'),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">数据分析</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">平均招聘周期</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.avgRecruitmentDays || 0}天</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">平均面试轮次</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.avgInterviewRounds || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Offer接受率</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.offerAcceptanceRate || 0}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">入职率</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.onboardingRate || 0}%</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>渠道转化分析</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels?.filter((c) => c.applied > 0).map((ch) => (
              <div key={ch.source}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{ch.source}</span>
                  <span>{ch.conversionRate}% 转化率</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, ch.conversionRate)}%` }}
                  />
                </div>
                <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                  <span>投递 {ch.applied}</span>
                  <span>面试 {ch.interviewed}</span>
                  <span>Offer {ch.offered}</span>
                  <span>入职 {ch.onboarded}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
