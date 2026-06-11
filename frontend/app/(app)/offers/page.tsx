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

interface Offer {
  id: string;
  candidateName: string;
  positionTitle: string;
  salary: number;
  currency: string;
  status: string;
  validUntil: string;
}

function fetchOffers(): Promise<Offer[]> {
  return ApiClient.get<Offer[]>("/offers");
}

export default function OffersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: fetchOffers,
  });

  const offers = data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Offers</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
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
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No offers found
                    </TableCell>
                  </TableRow>
                )}
                {offers.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.candidateName}</TableCell>
                    <TableCell>{o.positionTitle}</TableCell>
                    <TableCell>
                      {o.currency} {o.salary.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.status === "ACCEPTED"
                            ? "default"
                            : o.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(o.validUntil).toLocaleDateString()}</TableCell>
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
