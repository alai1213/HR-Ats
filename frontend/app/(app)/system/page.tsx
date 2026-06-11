"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  createdAt: string;
}

interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

function fetchRoles(): Promise<Role[]> {
  return ApiClient.get<Role[]>("/system/roles");
}

function fetchPermissions(): Promise<Permission[]> {
  return ApiClient.get<Permission[]>("/system/permissions");
}

function fetchAuditLogs(): Promise<PagedResponse<AuditLog>> {
  return ApiClient.get<PagedResponse<AuditLog>>("/system/audit-logs");
}

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState("roles");

  const rolesQuery = useQuery({
    queryKey: ["system", "roles"],
    queryFn: fetchRoles,
    enabled: activeTab === "roles",
  });

  const permissionsQuery = useQuery({
    queryKey: ["system", "permissions"],
    queryFn: fetchPermissions,
    enabled: activeTab === "permissions",
  });

  const auditLogsQuery = useQuery({
    queryKey: ["system", "audit-logs"],
    queryFn: fetchAuditLogs,
    enabled: activeTab === "audit-logs",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">System Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
            </CardHeader>
            <CardContent>
              {rolesQuery.isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(rolesQuery.data ?? []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          No roles found
                        </TableCell>
                      </TableRow>
                    )}
                    {(rolesQuery.data ?? []).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {permissionsQuery.isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(permissionsQuery.data ?? []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No permissions found
                        </TableCell>
                      </TableRow>
                    )}
                    {(permissionsQuery.data ?? []).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.resource}</TableCell>
                        <TableCell>{p.action}</TableCell>
                        <TableCell>{p.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogsQuery.isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(auditLogsQuery.data?.data ?? []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    )}
                    {(auditLogsQuery.data?.data ?? []).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.userName}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
