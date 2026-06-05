'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const STATUS_LABELS: Record<string, string> = {
  HR_SUBMITTED: 'HR已提交',
  MANAGER_APPROVED: '经理已审批',
  MANAGER_REJECTED: '经理已拒绝',
  HR_CONFIRMED: 'HR已确认',
  OFFER_SENT: 'Offer已发放',
  CANCELLED: '已取消',
};

export default function OffersPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['offers'],
    queryFn: () => api.get<any[]>('/offers'),
  });

  const approve = async (id: string, status: string) => {
    await api.patch(`/offers/${id}/approve`, { status });
    refetch();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Offer审批</h2>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p>加载中...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>候选人</TableHead>
                  <TableHead>薪资</TableHead>
                  <TableHead>入职日期</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((offer: any) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.candidate?.name}</TableCell>
                    <TableCell>{offer.salary || '-'}</TableCell>
                    <TableCell>{offer.startDate ? new Date(offer.startDate).toLocaleDateString('zh-CN') : '-'}</TableCell>
                    <TableCell>{offer.submitter?.name}</TableCell>
                    <TableCell><Badge>{STATUS_LABELS[offer.status]}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {offer.status === 'HR_SUBMITTED' && (
                          <Button size="sm" variant="outline" onClick={() => approve(offer.id, 'MANAGER_APPROVED')}>经理审批</Button>
                        )}
                        {offer.status === 'MANAGER_APPROVED' && (
                          <Button size="sm" variant="outline" onClick={() => approve(offer.id, 'HR_CONFIRMED')}>HR确认</Button>
                        )}
                        {offer.status === 'HR_CONFIRMED' && (
                          <Button size="sm" onClick={() => approve(offer.id, 'OFFER_SENT')}>发放Offer</Button>
                        )}
                      </div>
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
