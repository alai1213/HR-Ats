'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { POSITION_STATUS_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PositionsPage() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['positions', page, keyword],
    queryFn: () => api.get<any>(`/positions?page=${page}&pageSize=20&keyword=${keyword}`),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">职位管理</h2>
        <Button>创建职位</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Input
              placeholder="搜索职位名称、部门..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>加载中...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>职位名称</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>招聘人数</TableHead>
                    <TableHead>已入职</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((pos: any) => (
                    <TableRow key={pos.id}>
                      <TableCell className="font-medium">{pos.title}</TableCell>
                      <TableCell>{pos.department}</TableCell>
                      <TableCell>{pos.headcount}</TableCell>
                      <TableCell>{pos.hiredCount}</TableCell>
                      <TableCell>{pos.owner?.name}</TableCell>
                      <TableCell>
                        <Badge variant={pos.priority === 'URGENT' ? 'destructive' : 'secondary'}>
                          {pos.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pos.status === 'OPEN' ? 'success' : 'outline'}>
                          {POSITION_STATUS_LABELS[pos.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-between">
                <p className="text-sm text-muted-foreground">共 {data?.total || 0} 条</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
                  <Button variant="outline" size="sm" disabled={page >= (data?.totalPages || 1)} onClick={() => setPage(page + 1)}>下一页</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
