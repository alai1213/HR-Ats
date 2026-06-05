'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function RecommendationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.get<any[]>('/recommendations'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">推荐池</h2>
        <div className="flex gap-2">
          <Button variant="outline">导出 PDF</Button>
          <Button variant="outline">导出图片</Button>
        </div>
      </div>

      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{item.candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.candidate.currentCompany} · {item.candidate.currentPosition}
                    </p>
                  </div>
                  <Badge>{item.candidate.workYears ? `${item.candidate.workYears}年` : '-'}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">期望薪资：</span>{item.candidate.expectedSalary || '-'}</div>
                  <div><span className="text-muted-foreground">投递职位：</span>{item.candidate.position?.title || '-'}</div>
                </div>
                {item.highlight && <p className="mt-2 text-sm text-primary">{item.highlight}</p>}
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.candidate.tags?.map((t: any) => (
                    <Badge key={t.id} variant="outline">{t.tag}</Badge>
                  ))}
                </div>
                {item.candidate.files?.[0] && (
                  <a href={item.candidate.files[0].fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-primary hover:underline">
                    查看简历
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
