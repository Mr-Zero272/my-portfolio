'use client';

import { socialLinksApi } from '@/apis/social-links';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import EmptyState from '@/components/shared/state/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, EllipsisIcon, ExternalLink, Globe, Loader2, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Validation schema
const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
  username: z.string().optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

const PLATFORMS = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'website', label: 'Personal Website' },
  { value: 'other', label: 'Other' },
];

export function SocialLinksSettingsForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: '',
      url: '',
      username: '',
      isVisible: true,
      displayOrder: 0,
    },
  });

  // Query social links
  const { data: socialLinks = [], isLoading: loading } = useQuery({
    queryKey: ['social-links', 'list', { owner: true }],
    queryFn: () => socialLinksApi.getAll({ owner: true }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: socialLinksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success('Social link added successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create social link:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create social link');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => socialLinksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success('Social link updated successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update social link:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update social link');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: socialLinksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success('Social link deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete social link:', error);
      toast.error('Failed to delete social link');
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      platform: '',
      url: '',
      username: '',
      isVisible: true,
      displayOrder: socialLinks.length,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (socialLink: any) => {
    setEditingId(socialLink._id);
    form.reset({
      platform: socialLink.platform,
      url: socialLink.url,
      username: socialLink.username || '',
      isVisible: socialLink.isActive,
      displayOrder: socialLink.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      setIsDialogDeleteOpen(false);
    } catch (error) {
      console.error('Failed to delete social link:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete social link');
    }
  };

  const onSubmit = async (data: SocialLinkFormData) => {
    const apiData: any = {
      ...data,
      isActive: data.isVisible,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  return (
    <div className="space-y-6 md:pr-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Social Links</h2>
          <p className="text-sm text-muted-foreground">Manage your social media profiles and links.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> Add Link
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
        {!loading &&
          socialLinks.map((link) => (
            <Card key={link._id.toString()}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold capitalize">{link.platform}</CardTitle>
                    <CardDescription className="text-xs">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        {link.username || link.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(link)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Toggle menu">
                        <EllipsisIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive hover:text-destructive!"
                        onClick={() => {
                          setDeletingId(link._id.toString());
                          setIsDialogDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardFooter className="pt-2">
                {!link.isActive && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Hidden
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}

        {!loading && socialLinks.length === 0 && (
          <div className="col-span-2 py-12 text-center text-muted-foreground">
            <EmptyState
              title="No social links found"
              description="Add your social media profiles"
              action={
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4" /> Add Link
                </Button>
              }
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
            <DialogDescription>Add your social media profile. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PLATFORMS.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Visible</FormLabel>
                      <CardDescription>Show this link on your profile</CardDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        title="Delete Social Link"
        description="Are you sure you want to delete this social link?"
        open={isDialogDeleteOpen}
        onOpenChange={(open) => setIsDialogDeleteOpen(open)}
        onConfirm={() => handleDelete(deletingId!)}
        onCancel={() => setIsDialogDeleteOpen(false)}
      />
    </div>
  );
}
