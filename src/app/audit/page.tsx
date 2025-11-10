'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuditLogTable } from "@/components/app/audit-log-table";

export default function AuditLogPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>
          Review a chronological log of all activities within the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuditLogTable />
      </CardContent>
    </Card>
  );
}
