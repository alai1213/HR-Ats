'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function InterviewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => api.get<any>('/interviews?page=1&pageSize=50'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">面试管理</h2>
        <Button>安排面试</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p>加载中...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>候选人</TableHead>
                  <TableHead>轮次</TableHead>
                  <TableHead>面试时间</TableHead>
                  <TableHead>面试官</TableHead>
                  <TableHead>方式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>飞书日历</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((iv: any) => (
                  <TableRow key={iv.id}>
                    <TableCell className="font-medium">{iv.candidate?.name}</TableCell>
                    <TableCell>{iv.round}</TableCell>
                    <TableCell>{new Date(iv.scheduledAt).toLocaleString('zh-CN')}</TableCell>
                    <TableCell>{iv.interviewer?.name}</TableCell>
                    <TableCell>{iv.mode === 'ONLINE' ? '线上' : '线下'}</TableCell>
                    <TableCell><Badge variant="secondary">{iv.status}</Badge></TableCell>
                    <TableCell>
                      {iv.feishuCalendarEvent ? (
                        <a href={iv.feishuCalendarEvent.calendarLink} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">
                          查看日历
                        </a>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
