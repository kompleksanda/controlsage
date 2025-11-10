"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import type { Control } from "@/lib/data";
import { collection, query, where } from "firebase/firestore";
import { AssignControlDialog } from "./assign-control-dialog";

function getStatusVariant(status: Control['status']) {
  switch (status) {
    case 'Implemented':
      return 'default';
    case 'In Progress':
      return 'secondary';
    case 'Not Implemented':
      return 'destructive';
    default:
      return 'outline';
  }
}

interface ControlTableProps {
  frameworkFilter: string;
}

export function ControlTable({ frameworkFilter }: ControlTableProps) {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    
    const controlsQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      const baseCollection = collection(firestore, 'users', user.uid, 'controls');
      if (frameworkFilter === 'all') {
        return baseCollection;
      }
      return query(baseCollection, where('framework', '==', frameworkFilter));
    }, [firestore, user, frameworkFilter]);
    
    const { data: controls, isLoading } = useCollection<Control>(controlsQuery);
    const [selectedControl, setSelectedControl] = React.useState<Control | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);

    const handleAssignClick = (control: Control) => {
        setSelectedControl(control);
        setIsAssignDialogOpen(true);
    };

    const handleViewDetailsClick = (control: Control) => {
      router.push(`/controls/${encodeURIComponent(control.id)}`);
    };

    if (isLoading || isUserLoading) {
        return <div>Loading...</div>;
    }

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Control ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Framework</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {controls?.map((control) => (
          <TableRow key={control.id}>
            <TableCell className="font-medium">{control.id}</TableCell>
            <TableCell>{control.name}</TableCell>
            <TableCell>{control.framework}</TableCell>
            <TableCell className="hidden md:table-cell">{control.category}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(control.status)}>{control.status}</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => handleViewDetailsClick(control)}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleAssignClick(control)}>Assign to Asset</DropdownMenuItem>
                  <DropdownMenuItem>Upload Evidence</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {selectedControl && (
        <AssignControlDialog
          isOpen={isAssignDialogOpen}
          setIsOpen={setIsAssignDialogOpen}
          control={selectedControl}
        />
    )}
    </>
  );
}
