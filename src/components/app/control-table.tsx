"use client";

import * as React from "react";
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
import { controls, type Control } from "@/lib/data";

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

export function ControlTable() {
  return (
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
        {controls.map((control) => (
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
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Assign to Asset</DropdownMenuItem>
                  <DropdownMenuItem>Upload Evidence</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
