"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Interview {
  id: string;
  candidateName: string;
  positionTitle: string;
  interviewerName: string;
  scheduledAt: string;
  status: string;
  type: string;
}

interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

function fetchInterviews(): Promise<PagedResponse<Interview>> {
  return ApiClient.get<PagedResponse<Interview>>("/interviews");
}

export default function InterviewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: fetchInterviews,
  });

  const interviews = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Interviews</h1>
      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No interviews found
                    </TableCell>
                  </TableRow>
                )}
                {interviews.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.candidateName}</TableCell>
                    <TableCell>{i.positionTitle}</TableCell>
                    <TableCell>{i.interviewerName}</TableCell>
                    <TableCell>{i.type}</TableCell>
                    <TableCell>{new Date(i.scheduledAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={i.status === "COMPLETED" ? "default" : i.status === "CANCELLED" ? "destructive" : "secondary"}>
                        {i.status}
                      </Badge>
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
