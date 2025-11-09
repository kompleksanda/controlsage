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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { assets, type Asset } from "@/lib/data";

function getStatusVariant(status: Asset['status']) {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'secondary';
    case 'Decommissioned':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getClassificationVariant(classification: Asset['classification']) {
  switch (classification) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary';
    case 'Low':
      return 'default';
    default:
      return 'outline';
  }
}

export function AssetTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="hidden md:table-cell">Classification</TableHead>
          <TableHead className="hidden md:table-cell">Compliance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell className="font-medium">{asset.name}</TableCell>
            <TableCell>{asset.type}</TableCell>
            <TableCell>{asset.owner}</TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant={getClassificationVariant(asset.classification)}>{asset.classification}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <Progress value={asset.compliance} aria-label={`${asset.compliance}% compliance`} className="h-2" />
                    <span>{asset.compliance}%</span>
                </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
