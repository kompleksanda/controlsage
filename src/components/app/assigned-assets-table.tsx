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
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import type { ControlAssignment, Asset } from "@/lib/data";

function getStatusVariant(status: Asset['status']) {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Decommissioned': return 'destructive';
      default: return 'outline';
    }
  }

function AssignedAssetRow({ assetId }: { assetId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const assetRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'assets', assetId)
  }, [firestore, user, assetId]);

  const { data: asset, isLoading } = useDoc<Asset>(assetRef);

  if (isLoading || !asset) {
    return (
        <TableRow>
            <TableCell colSpan={4}>Loading asset data...</TableCell>
        </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`/assets/${asset.id}`} className="hover:underline text-primary">
            {asset.name}
        </Link>
      </TableCell>
      <TableCell>{asset.type}</TableCell>
      <TableCell>{asset.owner}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
      </TableCell>
    </TableRow>
  );
}


interface AssignedAssetsTableProps {
  controlId: string;
}

export function AssignedAssetsTable({ controlId }: AssignedAssetsTableProps) {
  const firestore = useFirestore();
  
  const assignmentsQuery = useMemoFirebase(() => {
    const baseCollection = collection(firestore, 'controlAssignments');
    return query(baseCollection, where('controlId', '==', controlId));
  }, [firestore, controlId]);
  
  const { data: assignments, isLoading } = useCollection<ControlAssignment>(assignmentsQuery);

  if (isLoading) {
    return <div>Loading assignments...</div>;
  }
  
  if (!assignments || assignments.length === 0) {
    return <p>This control has not been assigned to any assets.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <AssignedAssetRow key={assignment.id} assetId={assignment.assetId} />
        ))}
      </TableBody>
    </Table>
  );
}
