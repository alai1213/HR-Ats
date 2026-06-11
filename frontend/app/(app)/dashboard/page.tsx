"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, CalendarClock, FileText } from "lucide-react";

interface OverviewStats {
  totalPositions: number;
  totalCandidates: number;
  totalInterviews: number;
  totalOffers: number;
}

function fetchOverview(): Promise<OverviewStats> {
  return ApiClient.get<OverviewStats>("/dashboard/overview");
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: fetchOverview,
  });

  const stats = [
    { title: "Open Positions", value: data?.totalPositions ?? 0, icon: Briefcase },
    { title: "Candidates", value: data?.totalCandidates ?? 0, icon: Users },
    { title: "Interviews", value: data?.totalInterviews ?? 0, icon: CalendarClock },
    { title: "Offers", value: data?.totalOffers ?? 0, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "—" : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
