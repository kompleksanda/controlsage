"use client";

import * as React from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { Asset } from "@/lib/data";
import { doc } from "firebase/firestore";

function getStatusVariant(status: Asset['status']) {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Decommissioned': return 'destructive';
      default: return 'outline';
    }
}

function RelatedAssetRow({ assetId }: { assetId: string }) {
    const firestore = useFirestore();
    const assetRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'assets', assetId);
    }, [firestore, assetId]);

    const { data: asset, isLoading } = useDoc<Asset>(assetRef);

    if (isLoading || !asset) {
        return (
            <TableRow>
                <TableCell colSpan={3}>Loading asset data...</TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell className="font-medium">
                <Link href={`/assets/${asset.id}`} className="hover:underline text-primary">
                    {asset.name}
                </Link>
            </TableCell>
            <TableCell>{asset.type}</TableCell>
            <TableCell>
                <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
            </TableCell>
        </TableRow>
    );
}

interface RelatedAssetsCardProps {
    asset: Asset;
}

export function RelatedAssetsCard({ asset }: RelatedAssetsCardProps) {
    if (!asset.relatedAssetIds || asset.relatedAssetIds.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Related Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No related assets are linked.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Related Assets</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {asset.relatedAssetIds.map(id => (
                            <RelatedAssetRow key={id} assetId={id} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
