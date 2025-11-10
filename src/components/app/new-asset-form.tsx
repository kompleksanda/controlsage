'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Asset } from '@/lib/data';

const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required.'),
  type: z.enum(['Server', 'Application', 'Database', 'Endpoint']),
  owner: z.string().min(1, 'Owner is required.'),
  classification: z.enum(['Critical', 'High', 'Medium', 'Low']),
  status: z.enum(['Active', 'Inactive', 'Decommissioned']),
  tags: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface NewAssetFormProps {
  setDialogOpen?: (open: boolean) => void;
  asset?: Asset;
}

export function NewAssetForm({ setDialogOpen, asset }: NewAssetFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const isEditMode = !!asset;

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: asset?.name || '',
      type: asset?.type,
      owner: asset?.owner || '',
      classification: asset?.classification,
      status: asset?.status,
      tags: asset?.tags?.join(', ') || '',
    },
  });

  const onSubmit = async (values: AssetFormValues) => {
    if (!firestore || !user) return;

    try {
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      const assetsCollection = collection(firestore, 'assets');
      
      if (isEditMode && asset) {
        const assetRef = doc(assetsCollection, asset.id);
        setDocumentNonBlocking(assetRef, {
            ...asset,
            ...values,
            tags: tagsArray,
        }, { merge: true });
        toast({
          title: 'Asset updated',
          description: `${values.name} has been successfully updated.`,
        });
      } else {
        const newAssetId = `ASSET-${String(Date.now()).slice(-5)}-${Math.random().toString(36).substring(2, 7)}`;
        const assetRef = doc(assetsCollection, newAssetId);
        setDocumentNonBlocking(assetRef, {
          ...values,
          id: newAssetId,
          tags: tagsArray,
          ownerId: user.uid,
          compliance: Math.floor(Math.random() * 101), // Random compliance for now
        }, { merge: true });
        toast({
          title: 'Asset created',
          description: `${values.name} has been successfully created.`,
        });
      }
      
      if(setDialogOpen) setDialogOpen(false);
    } catch (error) {
      console.error('Error saving asset:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save asset.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Production Web Server" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Application">Application</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Endpoint">Endpoint</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alice Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classification</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a classification" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., backend, pci-scope" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags for grouping assets.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Asset'}</Button>
      </form>
    </Form>
  );
}
