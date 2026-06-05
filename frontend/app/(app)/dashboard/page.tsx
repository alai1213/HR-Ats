'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STAGE_LABELS } from '@/lib/constants';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<any>('/dashboard/overview'),
  });

  if (isLoading) return <div className="p-8">加载中...</div>;

  const { funnel, efficiency, channels, positions } = data || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">数据看板</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">简历总数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{funnel?.total || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">平均招聘周期</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.avgRecruitmentDays || 0} 天</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Offer接受率</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.offerAcceptanceRate || 0}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">入职率</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{efficiency?.onboardingRate || 0}%</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>招聘漏斗</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-2">
            {funnel?.funnel?.map((item: any) => (
              <div key={item.stage} className="flex flex-col items-center">
                <div
                  className="flex w-20 items-end justify-center rounded-t bg-primary/80 text-xs text-white"
                  style={{ height: `${Math.max(40, item.count * 8)}px` }}
                >
                  {item.count}
                </div>
                <p className="mt-1 w-20 text-center text-xs">{STAGE_LABELS[item.stage] || item.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>渠道效果</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">渠道</th>
                  <th className="py-2 text-right">投递</th>
                  <th className="py-2 text-right">面试</th>
                  <th className="py-2 text-right">入职</th>
                  <th className="py-2 text-right">转化率</th>
                </tr>
              </thead>
              <tbody>
                {channels?.map((ch: any) => (
                  <tr key={ch.source} className="border-b">
                    <td className="py-2">{ch.source}</td>
                    <td className="py-2 text-right">{ch.applied}</td>
                    <td className="py-2 text-right">{ch.interviewed}</td>
                    <td className="py-2 text-right">{ch.onboarded}</td>
                    <td className="py-2 text-right">{ch.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>职位完成情况</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">职位</th>
                  <th className="py-2 text-right">需求</th>
                  <th className="py-2 text-right">已入职</th>
                  <th className="py-2 text-right">完成率</th>
                </tr>
              </thead>
              <tbody>
                {positions?.map((p: any) => (
                  <tr key={p.id} className="border-b">
                    <td className="py-2">{p.title}</td>
                    <td className="py-2 text-right">{p.headcount}</td>
                    <td className="py-2 text-right">{p.hiredCount}</td>
                    <td className="py-2 text-right">{p.completionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
