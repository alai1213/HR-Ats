'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Star,
  FileCheck,
  Settings,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: '数据看板', icon: LayoutDashboard, perm: 'dashboard:read' },
  { href: '/positions', label: '职位管理', icon: Briefcase, perm: 'position:read' },
  { href: '/candidates', label: '候选人', icon: Users, perm: 'candidate:read:all' },
  { href: '/interviews', label: '面试管理', icon: Calendar, perm: 'interview:create' },
  { href: '/recommendations', label: '推荐池', icon: Star, perm: 'recommendation:write' },
  { href: '/offers', label: 'Offer审批', icon: FileCheck, perm: 'offer:approve' },
  { href: '/analytics', label: '数据分析', icon: BarChart3, perm: 'dashboard:read' },
  { href: '/system', label: '系统管理', icon: Settings, perm: 'system:manage' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuthStore();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-bold text-primary">HR ATS</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          if (item.perm && !hasPermission(item.perm) && !hasPermission('candidate:read:assigned')) {
            if (item.href === '/candidates' && hasPermission('candidate:read:assigned')) {
              // allow interviewers
            } else if (!hasPermission(item.perm)) {
              return null;
            }
          }
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="mb-2 text-sm font-medium">{user?.name}</p>
        <p className="mb-3 text-xs text-muted-foreground">{user?.roles.join(', ')}</p>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </Button>
      </div>
    </aside>
  );
}
