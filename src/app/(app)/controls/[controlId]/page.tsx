'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Control } from '@/lib/data';
import { BackButton } from '@/components/app/back-button';
import { AssignedAssetsTable } from '@/components/app/assigned-assets-table';
import { Separator } from '@/components/ui/separator';

export default function ControlDetailsPage() {
  const params = useParams();
  const { controlId } = params;
  const firestore = useFirestore();

  const controlRef = useMemoFirebase(() => {
    if (!firestore || !controlId) return null;
    // The controlId from URL might be encoded, so decode it.
    return doc(firestore, 'controls', decodeURIComponent(controlId as string));
  }, [firestore, controlId]);

  const { data: control, isLoading } = useDoc<Control>(controlRef);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading control details...</div>;
  }

  if (!control) {
    return <div className="flex items-center justify-center h-screen">Control not found.</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <BackButton />
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    {control.name}
                </h1>
            </div>
             <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Assigned Assets</CardTitle>
                            <CardDescription>
                                Assets that have this control assigned.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <AssignedAssetsTable controlId={control.id} />
                        </CardContent>
                    </Card>
                </div>
                 <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Control Details</CardTitle>
                            <CardDescription>{control.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                           <p className="text-muted-foreground">{control.description}</p>
                           <Separator />
                           <div className="grid gap-2">
                                <div className="font-semibold">Framework</div>
                                <div>{control.framework}</div>
                           </div>
                           <Separator />
                           <div className="grid gap-2">
                                <div className="font-semibold">Category</div>
                                <div>{control.category}</div>
                           </div>
                           <Separator />
                            <div className="grid gap-2">
                                <div className="font-semibold">Type</div>
                                <div>{control.type}</div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="font-semibold">Status</div>
                                <div>{control.status}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
