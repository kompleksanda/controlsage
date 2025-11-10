
'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewAssetForm } from '@/components/app/new-asset-form';
import type { Asset } from '@/lib/data';
import { BackButton } from '@/components/app/back-button';
import { AssignedControlsTable } from '@/components/app/assigned-controls-table';
import { Separator } from '@/components/ui/separator';

export default function AssetDetailsPage() {
  const params = useParams();
  const { assetId } = params;
  const firestore = useFirestore();
  const { user } = useUser();

  const assetRef = useMemoFirebase(() => {
    if (!firestore || !assetId || !user) return null;
    return doc(firestore, 'users', user.uid, 'assets', assetId as string);
  }, [firestore, user, assetId]);

  const { data: asset, isLoading } = useDoc<Asset>(assetRef);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading asset details...</div>;
  }

  if (!asset) {
    return <div className="flex items-center justify-center h-screen">Asset not found.</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <BackButton />
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    {asset.name}
                </h1>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                        <CardTitle>Edit Asset</CardTitle>
                        <CardDescription>
                            Update the details for the asset &quot;{asset.name}&quot;.
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NewAssetForm asset={asset} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Controls</CardTitle>
                            <CardDescription>
                                Security controls currently assigned to this asset.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AssignedControlsTable assetId={asset.id} />
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Asset Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                           <div className="grid gap-2">
                                <div className="font-semibold">Type</div>
                                <div>{asset.type}</div>
                           </div>
                           <Separator />
                           <div className="grid gap-2">
                                <div className="font-semibold">Owner</div>
                                <div>{asset.owner}</div>
                           </div>
                           <Separator />
                            <div className="grid gap-2">
                                <div className="font-semibold">Classification</div>
                                <div>{asset.classification}</div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="font-semibold">Status</div>
                                <div>{asset.status}</div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="font-semibold">Tags</div>
                                <div>{asset.tags?.join(', ') || 'No tags'}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
