'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SystemPage() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<any>('/users?page=1&pageSize=50'),
  });

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get<any[]>('/system/roles'),
  });

  const { data: logs } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.get<any>('/system/audit-logs?page=1&pageSize=20'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">系统管理</h2>
        <Button>新增用户</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>用户管理</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data?.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.department || '-'}</TableCell>
                  <TableCell>
                    {u.roles?.map((r: any) => (
                      <Badge key={r.roleId} variant="outline" className="mr-1">{r.role.name}</Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? 'success' : 'destructive'}>
                      {u.isActive ? '正常' : '禁用'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>角色管理</CardTitle></CardHeader>
          <CardContent>
            {roles?.map((role: any) => (
              <div key={role.id} className="mb-3 rounded-lg border p-3">
                <p className="font-medium">{role.name}</p>
                <p className="text-sm text-muted-foreground">{role.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {role.permissions?.length} 项权限 · {role._count?.users} 位用户
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>操作日志</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-80 space-y-2 overflow-auto">
              {logs?.data?.map((log: any) => (
                <div key={log.id} className="rounded border p-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.user?.name || '系统'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <p>{log.action} · {log.module} · {log.targetId}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
