"use client";

import * as React from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { Asset, RelatedAsset } from "@/lib/data";
import { doc } from "firebase/firestore";
import { ArrowRight } from "lucide-react";

function getStatusVariant(status: Asset['status']) {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Decommissioned': return 'destructive';
      default: return 'outline';
    }
}

function RelatedAssetRow({ relatedAsset }: { relatedAsset: RelatedAsset }) {
    const firestore = useFirestore();
    const assetRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'assets', relatedAsset.id);
    }, [firestore, relatedAsset.id]);

    const { data: asset, isLoading } = useDoc<Asset>(assetRef);

    if (isLoading || !asset) {
        return (
            <TableRow>
                <TableCell colSpan={4}>Loading asset data...</TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell>{relatedAsset.relationshipType}</TableCell>
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
    if (!asset.relatedAssets || asset.relatedAssets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Related Assets</CardTitle>
                    <CardDescription>
                        This asset has no defined relationships with other assets.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">You can add relationships by editing this asset.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Related Assets</CardTitle>
                <CardDescription>
                    This asset has the following relationships with other assets in the system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Relationship</TableHead>
                            <TableHead>Asset Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {asset.relatedAssets.map((related, index) => (
                           <React.Fragment key={`${related.id}-${index}`}>
                             <TableRow>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <span>{asset.name}</span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                                    </div>
                                </TableCell>
                                <TableCell colSpan={3}></TableCell>
                            </TableRow>
                            <RelatedAssetRow relatedAsset={related} />
                           </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
