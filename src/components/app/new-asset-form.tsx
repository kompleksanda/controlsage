'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useMemo } from 'react';
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
import { useFirestore, useUser, setDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Asset, relationshipTypes } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const relatedAssetSchema = z.object({
  id: z.string().min(1, 'Asset selection is required.'),
  relationshipType: z.enum(relationshipTypes),
});

const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required.'),
  type: z.enum(['Server', 'Application', 'Database', 'Endpoint', 'Software Feature']),
  owner: z.string().min(1, 'Owner is required.'),
  classification: z.enum(['Critical', 'High', 'Medium', 'Low']),
  status: z.enum(['Active', 'Inactive', 'Decommissioned']),
  tags: z.string().optional(),
  relatedAssets: z.array(relatedAssetSchema).optional(),
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

  const assetsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'assets');
  }, [firestore]);
  const { data: allAssets } = useCollection<Asset>(assetsQuery);

  const assetOptions = useMemo(() => {
    if (!allAssets) return [];
    // Exclude the current asset from the list of options
    return allAssets
      .filter(a => a.id !== asset?.id)
      .map(a => ({ value: a.id, label: a.name }));
  }, [allAssets, asset]);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: asset?.name || '',
      type: asset?.type,
      owner: asset?.owner || '',
      classification: asset?.classification,
      status: asset?.status,
      tags: asset?.tags?.join(', ') || '',
      relatedAssets: asset?.relatedAssets || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'relatedAssets',
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
                  <SelectItem value="Software Feature">Software Feature</SelectItem>
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
        
        <Card>
            <CardHeader>
                <CardTitle>Related Assets</CardTitle>
                <FormDescription>
                    Link this asset to other assets in the system and define the relationship.
                </FormDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                         <FormField
                            control={form.control}
                            name={`relatedAssets.${index}.id`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asset</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an asset..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assetOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`relatedAssets.${index}.relationshipType`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relationship</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a relationship" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {relationshipTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove relationship</span>
                        </Button>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ id: '', relationshipType: 'Related To' })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Relationship
                </Button>
            </CardContent>
        </Card>
        
        <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Asset'}</Button>
      </form>
    </Form>
  );
}
