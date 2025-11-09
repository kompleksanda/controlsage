"use client";

import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import type { AuditLog } from "@/lib/data";
import { formatDistanceToNow } from 'date-fns';

export function AuditLogTable() {
    const firestore = useFirestore();
    const auditLogsQuery = useMemoFirebase(() => query(collection(firestore, 'auditLogs'), orderBy('date', 'desc')), [firestore]);
    const { data: auditLogs, isLoading } = useCollection<AuditLog>(auditLogsQuery);

    if (isLoading) {
        return <div>Loading...</div>;
    }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="hidden md:table-cell">Details</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs?.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Image
                  src={log.userAvatar}
                  alt={`${log.user}'s avatar`}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{log.user}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{log.action}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{log.details}</TableCell>
            <TableCell className="text-right text-muted-foreground">
                {log.date && formatDistanceToNow(new Date((log.date as any).seconds * 1000), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
