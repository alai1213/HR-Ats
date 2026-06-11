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

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  status: string;
  createdAt: string;
}

interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

function fetchPositions(): Promise<PagedResponse<Position>> {
  return ApiClient.get<PagedResponse<Position>>("/positions");
}

export default function PositionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  const positions = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Positions</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No positions found
                    </TableCell>
                  </TableRow>
                )}
                {positions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.department}</TableCell>
                    <TableCell>{p.location}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "OPEN" ? "default" : "secondary"}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
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
