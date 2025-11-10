
'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewAssetForm } from '@/components/app/new-asset-form';
import type { Asset } from '@/lib/data';
import { BackButton } from '@/components/app/back-button';

export default function AssetDetailsPage() {
  const params = useParams();
  const { assetId } = params;
  const firestore = useFirestore();

  const assetRef = useMemoFirebase(() => {
    if (!firestore || !assetId) return null;
    return doc(firestore, 'assets', assetId as string);
  }, [firestore, assetId]);

  const { data: asset, isLoading } = useDoc<Asset>(assetRef);

  if (isLoading) {
    return <div>Loading asset details...</div>;
  }

  if (!asset) {
    return <div>Asset not found.</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <BackButton />
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    {asset.name}
                </h1>
            </div>
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
        </div>
    </div>
  );
}
