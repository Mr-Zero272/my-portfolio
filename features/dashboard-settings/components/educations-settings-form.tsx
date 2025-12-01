'use client';

import { educationsApi } from '@/apis/educations';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import EmptyState from '@/components/shared/state/empty-state';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Edit, EllipsisIcon, GraduationCap, Loader2, MapPin, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Validation schema
const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

type EducationFormData = z.infer<typeof educationSchema>;

export function EducationsSettingsForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      description: '',
      location: '',
      isVisible: true,
      displayOrder: 0,
    },
  });

  // Query educations
  const { data: educations = [], isLoading: loading } = useQuery({
    queryKey: ['educations', { owner: true }],
    queryFn: () => educationsApi.getAll({ owner: true }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: educationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education added successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create education:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create education');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => educationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education updated successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update education:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update education');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: educationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete education:', error);
      toast.error('Failed to delete education');
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      description: '',
      location: '',
      isVisible: true,
      displayOrder: educations.length,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (education: any) => {
    setEditingId(education._id);
    form.reset({
      ...education,
      startDate: education.startDate ? new Date(education.startDate) : undefined,
      endDate: education.endDate ? new Date(education.endDate) : undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      setIsDialogDeleteOpen(false);
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete education');
    }
  };

  const onSubmit = async (data: EducationFormData) => {
    // Format data for API
    const apiData: any = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : undefined,
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
          <h2 className="text-lg font-medium">Education</h2>
          <p className="text-sm text-muted-foreground">Manage your educational background.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-64" />)}
        {!loading &&
          educations.map((education) => (
            <Card key={education._id.toString()}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold">{education.institution}</CardTitle>
                    <CardDescription className="text-xs">
                      {education.degree} {education.fieldOfStudy && `- ${education.fieldOfStudy}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(education)}>
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
                          setEditingId(education._id.toString());
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
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {format(new Date(education.startDate), 'MMM yyyy')} -{' '}
                      {education.endDate ? format(new Date(education.endDate), 'MMM yyyy') : 'Present'}
                    </span>
                  </div>
                  {education.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{education.location}</span>
                    </div>
                  )}
                </div>
                {education.description && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{education.description}</p>
                )}
              </CardContent>
              <CardFooter>
                {!education.isVisible && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Hidden
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}

        {!loading && educations.length === 0 && (
          <div className="col-span-2 py-12 text-center text-muted-foreground">
            <EmptyState
              title="No education found"
              description="Add your educational background"
              action={
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4" /> Add Education
                </Button>
              }
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>Add details about your education. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution *</FormLabel>
                      <FormControl>
                        <Input placeholder="University Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree *</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor's, Master's, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Present / Ongoing</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional details..." rows={4} {...field} />
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
                      <CardDescription>Show this education on your profile</CardDescription>
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
        title="Delete Education"
        description="Are you sure you want to delete this education entry?"
        open={isDialogDeleteOpen}
        onOpenChange={(open) => setIsDialogDeleteOpen(open)}
        onConfirm={() => handleDelete(deletingId!)}
        onCancel={() => setIsDialogDeleteOpen(false)}
      />
    </div>
  );
}
