'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { LayoutGrid, List } from 'lucide-react';
import { api } from '@/lib/api';
import { STAGE_LABELS, SOURCE_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CandidatesPage() {
  const [view, setView] = useState<'card' | 'table'>('table');
  const [keyword, setKeyword] = useState('');
  const [stage, setStage] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['candidates', page, keyword, stage],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (keyword) params.set('keyword', keyword);
      if (stage) params.set('stage', stage);
      return api.get<any>(`/candidates?${params}`);
    },
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const batchUpdateStage = async (newStage: string) => {
    if (!selected.length) return;
    await api.post('/candidates/batch', { ids: selected, stage: newStage });
    setSelected([]);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">候选人总看板</h2>
        <div className="flex gap-2">
          <Button variant={view === 'table' ? 'default' : 'outline'} size="icon" onClick={() => setView('table')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={view === 'card' ? 'default' : 'outline'} size="icon" onClick={() => setView('card')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button>新增候选人</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="搜索姓名、手机、邮箱、公司..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-sm"
        />
        <select
          className="h-9 rounded-md border px-3 text-sm"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="">全部阶段</option>
          {Object.entries(STAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        {selected.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => batchUpdateStage('HR_INTERVIEW')}>
              批量推进 ({selected.length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => api.post('/recommendations/batch', { candidateIds: selected }).then(() => refetch())}>
              加入推荐池
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <p>加载中...</p>
      ) : view === 'table' ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelected(data?.data?.map((c: any) => c.id) || []);
                      else setSelected([]);
                    }} />
                  </TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>当前公司</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>阶段</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>负责人</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={`/candidates/${c.id}`} className="font-medium text-primary hover:underline">
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell>{c.currentCompany || '-'}</TableCell>
                    <TableCell>{c.position?.title || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{STAGE_LABELS[c.stage]}</Badge>
                    </TableCell>
                    <TableCell>{SOURCE_LABELS[c.source]}</TableCell>
                    <TableCell>{c.owner?.name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((c: any) => (
            <Card key={c.id} className="cursor-pointer hover:shadow-md" onClick={() => window.location.href = `/candidates/${c.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.currentCompany} · {c.currentPosition}</p>
                  </div>
                  <Badge>{STAGE_LABELS[c.stage]}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.tags?.map((t: any) => (
                    <Badge key={t.id} variant="outline">{t.tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">共 {data?.total || 0} 人</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
          <Button variant="outline" size="sm" disabled={page >= (data?.totalPages || 1)} onClick={() => setPage(page + 1)}>下一页</Button>
        </div>
      </div>
    </div>
  );
}
