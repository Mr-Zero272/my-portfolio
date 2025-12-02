'use client';

import { projectsApi } from '@/apis/projects';
import { Github } from '@/components/icons';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import ImageUploadV2 from '@/components/shared/image-upload-v2';
import EmptyState from '@/components/shared/state/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { uploadImageWithDB } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  BadgeCheckIcon,
  CalendarIcon,
  CodeXmlIcon,
  Edit,
  EllipsisIcon,
  Globe,
  LayoutTemplate,
  Link2,
  Loader2,
  Plus,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Validation schema
const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.string().optional(),
  type: z.enum(['website', 'mobile', 'desktop', 'api', 'library', 'other']).default('website'),
  status: z.enum(['planning', 'developing', 'completed', 'deployed', 'maintenance', 'archived']).default('developing'),

  // Media
  thumbnailImage: z.union([z.string(), z.any()]).optional(),
  images: z.array(z.string()).optional(),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  sourceCodeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),

  // Technical Details
  technologies: z.array(z.string()).optional(),
  databases: z.array(z.string()).optional(),

  // Dates
  startDate: z.date().optional(),
  endDate: z.date().optional(),

  // Display
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().default(0),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const projectTypes = [
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'mobile', label: 'Mobile App', icon: Smartphone },
  { value: 'desktop', label: 'Desktop App', icon: LayoutTemplate },
  { value: 'api', label: 'API', icon: CodeXmlIcon },
  { value: 'library', label: 'Library', icon: CodeXmlIcon },
  { value: 'other', label: 'Other', icon: CodeXmlIcon },
];

const projectStatuses = [
  { value: 'planning', label: 'Planning' },
  { value: 'developing', label: 'Developing' },
  { value: 'completed', label: 'Completed' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'archived', label: 'Archived' },
];

const defaultTechnologies = [
  { label: 'React', value: 'React' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'TailwindCSS', value: 'TailwindCSS' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'GraphQL', value: 'GraphQL' },
  { label: 'Docker', value: 'Docker' },
  { label: 'AWS', value: 'AWS' },
  { label: 'Firebase', value: 'Firebase' },
  { label: 'Supabase', value: 'Supabase' },
  { label: 'Prisma', value: 'Prisma' },
  { label: 'Redux', value: 'Redux' },
  { label: 'Zustand', value: 'Zustand' },
  { label: 'React Query', value: 'React Query' },
];

export function ProjectsSettingsForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      responsibilities: '',
      type: 'website',
      status: 'developing',
      thumbnailImage: '',
      images: [],
      demoUrl: '',
      sourceCodeUrl: '',
      technologies: [],
      databases: [],
      isFeatured: false,
      isVisible: true,
      displayOrder: 0,
      metaTitle: '',
      metaDescription: '',
    },
  });

  // Query projects
  const { data: projects = [], isLoading: loading } = useQuery({
    queryKey: ['projects', 'list', { owner: true }],
    queryFn: () => projectsApi.getAll({ owner: true }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!editingId) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: '',
      slug: '',
      description: '',
      responsibilities: '',
      type: 'website',
      status: 'developing',
      thumbnailImage: '',
      images: [],
      demoUrl: '',
      sourceCodeUrl: '',
      technologies: [],
      databases: [],
      isFeatured: false,
      isVisible: true,
      displayOrder: projects.length, // Default to end of list
      metaTitle: '',
      metaDescription: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    form.reset({
      ...project,
      startDate: project.startDate ? new Date(project.startDate) : undefined,
      endDate: project.endDate ? new Date(project.endDate) : undefined,
      demoUrl: project.demoUrl || '',
      sourceCodeUrl: project.sourceCodeUrl || '',
      thumbnailImage: project.thumbnailImage || '',
      responsibilities: project.responsibilities || '',
      metaTitle: project.metaTitle || '',
      metaDescription: project.metaDescription || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      setIsDialogDeleteOpen(false);
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete project');
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    let thumbnailImageUrl = data.thumbnailImage;

    // Upload image if it's a File
    if (data.thumbnailImage instanceof File) {
      try {
        const uploadedUrl = await uploadImageWithDB(data.thumbnailImage, session?.user?.id || '');
        if (uploadedUrl) {
          thumbnailImageUrl = uploadedUrl;
        } else {
          toast.error('Failed to upload image');
          return;
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Failed to upload image');
        return;
      }
    }

    // Format data for API
    const apiData: any = {
      ...data,
      thumbnailImage: thumbnailImageUrl,
      startDate: data.startDate ? data.startDate.toISOString() : undefined,
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
          <h2 className="text-lg font-medium">Projects</h2>
          <p className="text-sm text-muted-foreground">Manage your portfolio projects.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading &&
          Array.from({ length: 4 }, (_, index) => (
            <Card className="" key={index}>
              <CardHeader className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex flex-col gap-0.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="size-6 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <Skeleton className="aspect-video w-full rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-1">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="size-6 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        {!loading &&
          projects.map((project) => (
            <Card className="" key={project._id.toString()}>
              <CardHeader className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-ring">
                    <AvatarImage
                      src={session?.user?.image || 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png'}
                      alt={session?.user?.name || 'User'}
                    />
                    <AvatarFallback className="text-xs">{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <CardTitle className="flex items-center gap-1 text-sm">
                      {session?.user?.name || 'Unknown'}{' '}
                      <BadgeCheckIcon className="size-4 fill-sky-600 stroke-white dark:fill-sky-400" />
                    </CardTitle>
                    <CardDescription>@{session?.user?.email || 'anonymous'}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Toggle menu">
                        <EllipsisIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive hover:text-destructive!"
                        onClick={() => {
                          setEditingId(project._id.toString());
                          setIsDialogDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="text-destructive" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <img
                  src={project.thumbnailImage}
                  alt={project.name}
                  className="aspect-video w-full rounded-md object-cover"
                />
                <p className="wrap-anywhere">
                  {project.description}
                  {project.technologies.map((tech) => (
                    <span key={tech} className="ark:text-sky-400 text-sky-600">
                      #{tech}
                    </span>
                  ))}
                </p>
              </CardContent>
              <CardFooter className="flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={project.sourceCodeUrl!}>
                    <Github />
                  </Link>
                </Button>
                {project.demoUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={project.demoUrl}>
                      <Link2 />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

        {!loading && projects.length === 0 && (
          <div className="col-span-2 py-12 text-center text-muted-foreground">
            <EmptyState
              title="No projects found"
              description="Add a project to get started"
              action={
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
              }
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>Add details about your project. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Basic Info */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. My Portfolio" {...field} onChange={handleNameChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. my-portfolio" {...field} />
                        </FormControl>
                        <FormDescription>URL-friendly identifier</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  <span>{type.label}</span>
                                </div>
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description & Media */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="thumbnailImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                          <ImageUploadV2
                            value={field.value ? [field.value] : []}
                            onChange={(files) => field.onChange(files[0] || '')}
                            maxFiles={1}
                            multiple={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief summary of the project" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="mr-2 space-y-0.5">
                            <FormLabel className="text-sm">Featured</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isVisible"
                      render={({ field }) => (
                        <FormItem className="flex flex-1 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="mr-2 space-y-0.5">
                            <FormLabel className="text-sm">Visible</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* URLs */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="demoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sourceCodeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Code URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
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
              </div>

              <Separator />

              {/* Tech Stack */}
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={defaultTechnologies}
                        onValueChange={field.onChange}
                        defaultValue={field.value || []}
                        placeholder="Select technologies"
                        variant="inverted"
                        animation={2}
                        maxCount={10}
                        allowCreateOption
                        onCreateOption={(inputValue) => {
                          return { label: inputValue, value: inputValue };
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities / Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of your role and responsibilities..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
        title="Delete Project"
        description="Are you sure you want to delete this project?"
        open={isDialogDeleteOpen}
        onOpenChange={(open) => setIsDialogDeleteOpen(open)}
        onConfirm={() => handleDelete(deletingId!)}
        onCancel={() => setIsDialogDeleteOpen(false)}
      />
    </div>
  );
}
