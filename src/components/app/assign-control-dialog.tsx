'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Control, Asset } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignControlDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  control: Control;
}

export function AssignControlDialog({ isOpen, setIsOpen, control }: AssignControlDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const assetsQuery = useMemoFirebase(() => collection(firestore, 'assets'), [firestore]);
  const { data: assets, isLoading } = useCollection<Asset>(assetsQuery);

  const handleAssign = async () => {
    if (!firestore || !user || selectedAssets.length === 0) return;

    try {
      const assignmentsCollection = collection(firestore, 'controlAssignments');
      const assignmentPromises = selectedAssets.map(assetId => 
        addDocumentNonBlocking(assignmentsCollection, {
            controlId: control.id,
            assetId: assetId,
            assignedBy: user.uid,
            assignedAt: new Date().toISOString(),
            id: `ASGN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        })
      );
      
      await Promise.all(assignmentPromises);

      toast({
        title: 'Control Assigned',
        description: `${control.name} has been assigned to ${selectedAssets.length} asset(s).`,
      });
      setIsOpen(false);
      setSelectedAssets([]);
    } catch (error) {
      console.error('Error assigning control:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to assign control.',
      });
    }
  };

  const handleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Control: {control.name}</DialogTitle>
          <DialogDescription>
            Select the assets to which this control should be applied.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <p>Loading assets...</p>
          ) : (
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Available Assets</h4>
                {assets?.map(asset => (
                  <div key={asset.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`asset-${asset.id}`}
                      checked={selectedAssets.includes(asset.id)}
                      onCheckedChange={() => handleAssetSelection(asset.id)}
                    />
                    <Label htmlFor={`asset-${asset.id}`} className="font-normal">
                      {asset.name} ({asset.type})
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAssign} disabled={selectedAssets.length === 0}>
            Assign Control
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
    