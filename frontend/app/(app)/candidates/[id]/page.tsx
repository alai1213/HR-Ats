'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { STAGE_LABELS, SOURCE_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => api.get<any>(`/candidates/${id}`),
  });

  if (isLoading) return <div>加载中...</div>;
  if (!candidate) return <div>候选人不存在</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{candidate.name}</h2>
          <p className="text-muted-foreground">
            {candidate.currentCompany} · {candidate.currentPosition}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{STAGE_LABELS[candidate.stage]}</Badge>
          <Button variant="outline" size="sm">编辑资料</Button>
          <Button variant="outline" size="sm">安排面试</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">手机</span><span>{candidate.phone || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">邮箱</span><span>{candidate.email || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">微信</span><span>{candidate.wechat || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">城市</span><span>{candidate.city || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">学历</span><span>{candidate.education || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">期望薪资</span><span>{candidate.expectedSalary || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">来源</span><span>{SOURCE_LABELS[candidate.source]}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>招聘信息</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">投递职位</span><span>{candidate.position?.title || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">招聘负责人</span><span>{candidate.owner?.name || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">工作年限</span><span>{candidate.workYears ? `${candidate.workYears}年` : '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">毕业院校</span><span>{candidate.school || '-'}</span></div>
            <div>
              <span className="text-muted-foreground">标签</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {candidate.tags?.map((t: any) => <Badge key={t.id} variant="outline">{t.tag}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>面试记录</CardTitle></CardHeader>
        <CardContent>
          {candidate.interviews?.length ? (
            <div className="space-y-3">
              {candidate.interviews.map((iv: any) => (
                <div key={iv.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{iv.round} 轮面试</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(iv.scheduledAt).toLocaleString('zh-CN')} · {iv.interviewer?.name}
                    </p>
                  </div>
                  <Badge>{iv.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无面试记录</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>面评记录</CardTitle></CardHeader>
        <CardContent>
          {candidate.interviewFeedbacks?.length ? (
            <div className="space-y-4">
              {candidate.interviewFeedbacks.map((fb: any) => (
                <div key={fb.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{fb.evaluator?.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(fb.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>技术: {fb.technicalScore || '-'}/5</span>
                    <span>沟通: {fb.communicationScore || '-'}/5</span>
                    <span>项目: {fb.projectScore || '-'}/5</span>
                    <Badge variant={fb.result === 'PASS' ? 'success' : 'destructive'}>{fb.result}</Badge>
                  </div>
                  {fb.detailComment && <p className="mt-2 text-sm">{fb.detailComment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无面评记录</p>
          )}
        </CardContent>
      </Card>

      {candidate.hrNotes && (
        <Card>
          <CardHeader><CardTitle>HR备注</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{candidate.hrNotes}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
