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
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const controlSchema = z.object({
  id: z.string().min(1, 'Control ID is required.'),
  name: z.string().min(1, 'Control name is required.'),
  framework: z.enum(['ISO 27001', 'NIST', 'CIS', 'Custom']),
  category: z.string().min(1, 'Category is required.'),
  type: z.enum(['Preventive', 'Detective', 'Corrective']),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Implemented', 'In Progress', 'Not Implemented']),
});

type ControlFormValues = z.infer<typeof controlSchema>;

interface NewControlFormProps {
  setDialogOpen: (open: boolean) => void;
}

export function NewControlForm({ setDialogOpen }: NewControlFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<ControlFormValues>({
    resolver: zodResolver(controlSchema),
    defaultValues: {
      id: '',
      name: '',
      category: '',
      description: '',
    },
  });

  const onSubmit = async (values: ControlFormValues) => {
    if (!firestore || !user) return;

    try {
      const controlsCollection = collection(firestore, 'controls');
      const controlRef = doc(controlsCollection, values.id);
      setDocumentNonBlocking(controlRef, { ...values, ownerId: user.uid }, {});
      toast({
        title: 'Control created',
        description: `${values.name} has been successfully created.`,
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating control:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create control.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Control ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ISO-A.12.1.2" {...field} />
              </FormControl>
              <FormDescription>
                A unique identifier for the control.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Control Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Protection against Malware" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="framework"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Framework</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                  <SelectItem value="NIST">NIST</SelectItem>
                  <SelectItem value="CIS">CIS</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Operations Security" {...field} />
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
              <FormLabel>Control Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a control type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Detective">Detective</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
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
                  <SelectItem value="Implemented">Implemented</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the control..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Control</Button>
      </form>
    </Form>
  );
}
