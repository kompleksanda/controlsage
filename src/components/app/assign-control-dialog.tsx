
'use client';

import { useState, useMemo } from 'react';
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
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Control, Asset } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [tagFilter, setTagFilter] = useState('all');

  const assetsQuery = useMemoFirebase(() => collection(firestore, 'assets'), [firestore]);
  const { data: assets, isLoading } = useCollection<Asset>(assetsQuery);

  const allTags = useMemo(() => {
    if (!assets) return [];
    const tags = new Set<string>();
    assets.forEach(asset => {
      asset.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    if (tagFilter === 'all') {
      return assets;
    }
    return assets?.filter(asset => asset.tags?.includes(tagFilter));
  }, [assets, tagFilter]);

  const handleToggleSelectAll = () => {
    if (!filteredAssets) return;
    const allFilteredIds = filteredAssets.map(a => a.id);
    // If all filtered assets are already selected, deselect them. Otherwise, select them all.
    const areAllSelected = allFilteredIds.every(id => selectedAssets.includes(id));
    
    if (areAllSelected) {
      setSelectedAssets(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedAssets(prev => [...new Set([...prev, ...allFilteredIds])]);
    }
  };


  const handleAssign = async () => {
    if (!firestore || !user || selectedAssets.length === 0) return;

    try {
      const assignmentsCollection = collection(firestore, 'controlAssignments');
      const assignmentPromises = selectedAssets.map(assetId => {
        const assignmentId = `ASGN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const assignmentRef = doc(assignmentsCollection, assignmentId);
        return setDocumentNonBlocking(assignmentRef, {
            controlId: control.id,
            assetId: assetId,
            assignedBy: user.uid,
            assignedAt: new Date().toISOString(),
            id: assignmentId,
        }, {});
      });
      
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
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            setTagFilter('all');
            setSelectedAssets([]);
        }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Control: {control.name}</DialogTitle>
          <DialogDescription>
            Select assets to apply this control. Use the filter to select by tag.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center gap-2">
                <div className="flex-grow">
                    <Label htmlFor="tag-filter" className="sr-only">Filter by tag</Label>
                    <Select value={tagFilter} onValueChange={setTagFilter}>
                        <SelectTrigger id="tag-filter">
                            <SelectValue placeholder="Filter by tag..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {allTags.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" onClick={handleToggleSelectAll} disabled={!filteredAssets || filteredAssets.length === 0}>
                    Select All
                </Button>
            </div>
          {isLoading ? (
            <p>Loading assets...</p>
          ) : (
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Available Assets ({filteredAssets?.length || 0})</h4>
                {filteredAssets?.map(asset => (
                  <div key={asset.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`asset-${asset.id}`}
                      checked={selectedAssets.includes(asset.id)}
                      onCheckedChange={() => handleAssetSelection(asset.id)}
                    />
                    <Label htmlFor={`asset-${asset.id}`} className="font-normal">
                      {asset.name} <span className="text-muted-foreground">({asset.type})</span>
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
            Assign to {selectedAssets.length} asset(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
    
    