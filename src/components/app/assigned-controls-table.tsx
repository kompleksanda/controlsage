"use client";

import * as React from "react";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import type { ControlAssignment, Control } from "@/lib/data";

function getStatusVariant(status: Control['status']) {
    switch (status) {
      case 'Implemented': return 'default';
      case 'In Progress': return 'secondary';
      case 'Not Implemented': return 'destructive';
      default: return 'outline';
    }
}

function AssignedControlRow({ controlId }: { controlId: string }) {
  const firestore = useFirestore();
  const controlRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'controls', controlId)
  }, [firestore, controlId]);
  
  const { data: control, isLoading } = useDoc<Control>(controlRef);

  if (isLoading || !control) {
    return (
        <TableRow>
            <TableCell colSpan={4}>Loading control data...</TableCell>
        </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`/controls/${control.id}`} className="hover:underline text-primary">
            {control.name}
        </Link>
      </TableCell>
      <TableCell>{control.framework}</TableCell>
      <TableCell>{control.category}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(control.status)}>{control.status}</Badge>
      </TableCell>
    </TableRow>
  );
}


interface AssignedControlsTableProps {
  assetId: string;
}

export function AssignedControlsTable({ assetId }: AssignedControlsTableProps) {
  const firestore = useFirestore();
  const assignmentsQuery = useMemoFirebase(() => {
    const baseCollection = collection(firestore, 'controlAssignments');
    return query(baseCollection, where('assetId', '==', assetId));
  }, [firestore, assetId]);
  
  const { data: assignments, isLoading } = useCollection<ControlAssignment>(assignmentsQuery);

  if (isLoading) {
    return <div>Loading assignments...</div>;
  }
  
  if (!assignments || assignments.length === 0) {
    return <p>No controls have been assigned to this asset yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Control Name</TableHead>
          <TableHead>Framework</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <AssignedControlRow key={assignment.id} controlId={assignment.controlId} />
        ))}
      </TableBody>
    </Table>
  );
}
