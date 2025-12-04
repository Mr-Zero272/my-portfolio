'use client';

import { skillsApi, UpdateSkillDto } from '@/apis/skills';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import ImageUploadV2 from '@/components/shared/image-upload-v2';
import EmptyState from '@/components/shared/state/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker, ColorPickerFormat, ColorPickerHue } from '@/components/ui/shadcn-io/color-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { uploadFile } from '@/lib/uploadthing';
import { ISkill } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, EllipsisIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Validation schema
const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Proficient', 'Expert']).default('Intermediate'),
  category: z.enum(['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Language', 'Other']).default('Frontend'),
  icon: z.union([z.string(), z.any()]).optional(),
  iconColor: z.string().optional(),
  description: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  displayOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

type SkillFormData = z.infer<typeof skillSchema>;

const proficiencyLevels = ['Beginner', 'Intermediate', 'Proficient', 'Expert'];
const skillCategories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Language', 'Other'];

export function SkillsSettingsForm() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      proficiency: 'Intermediate',
      category: 'Frontend',
      icon: '',
      iconColor: '#000000',
      description: '',
      yearsOfExperience: 0,
      displayOrder: 0,
      isVisible: true,
    },
  });

  // Query skills
  const { data: skills = [], isLoading: loading } = useQuery({
    queryKey: ['skills', 'list', { owner: true }],
    queryFn: () => skillsApi.getAll({ owner: true }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: skillsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'], exact: false });
      toast.success('Skill created successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create skill:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create skill');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSkillDto }) => skillsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'], exact: false });
      toast.success('Skill updated successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update skill:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update skill');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: skillsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'], exact: false });
      toast.success('Skill deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill');
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: '',
      proficiency: 'Intermediate',
      category: 'Frontend',
      icon: '',
      iconColor: '#000000',
      description: '',
      yearsOfExperience: 0,
      displayOrder: skills.length,
      isVisible: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: ISkill) => {
    setEditingId(skill._id.toString());
    form.reset({
      ...skill,
      icon: skill.icon || '',
      iconColor: skill.iconColor || '#000000',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      setIsDialogDeleteOpen(false);
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete skill');
    }
  };

  const onSubmit = async (data: SkillFormData) => {
    let iconUrl = data.icon;

    // Upload image if it's a File
    if (data.icon instanceof File) {
      try {
        const uploadedRes = await uploadFile(data.icon);
        if (uploadedRes.data) {
          iconUrl = uploadedRes.data.url;
        } else {
          toast.error('Failed to upload icon');
          return;
        }
      } catch (error) {
        console.error('Icon upload failed:', error);
        toast.error('Failed to upload icon');
        return;
      }
    }

    // Format data for API
    const apiData = {
      ...data,
      icon: iconUrl,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  return (
    <div className="max-w-7xl space-y-6 md:pr-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Skills</h2>
          <p className="text-sm text-muted-foreground">Manage your technical skills.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="group">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10" />
                  <div>
                    <Skeleton className="mb-2 h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="size-8" />
              </CardHeader>
              <CardContent>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}

        {!loading &&
          skills.map((skill) => (
            <Card key={skill._id.toString()} className="group">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  {skill.icon ? (
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      className="h-10 w-10 rounded-md object-contain"
                      // style={{ backgroundColor: skill.iconColor ? `${skill.iconColor}20` : 'transparent' }}
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-lg font-bold"
                      style={{ color: skill.iconColor }}
                    >
                      {skill.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base font-medium">{skill.name}</CardTitle>
                    <CardDescription className="text-xs">{skill.category}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <EllipsisIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(skill)}>
                      <Edit className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setDeletingId(skill._id.toString());
                        setIsDialogDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <Badge variant="secondary">{skill.proficiency}</Badge>
                  {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                    <Badge variant="secondary">{skill.yearsOfExperience} years</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

        {!loading && skills.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <EmptyState
              title="No skills found"
              description="Add a skill to showcase your expertise"
              action={
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4" /> Add Skill
                </Button>
              }
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <DialogDescription>Add details about your skill. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="proficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select proficiency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
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
                name="iconColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Color</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: field.value }} />
                            {field.value}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <ColorPicker
                            value={field.value}
                            onChange={(v) => {
                              // Handle color value - if it's already a string, use it directly
                              if (typeof v === 'string') {
                                field.onChange(v);
                              } else if (Array.isArray(v)) {
                                // Convert RGBA array to hex
                                const [r, g, b] = v;
                                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                field.onChange(hex);
                              }
                            }}
                            className="w-[200px]"
                          >
                            <ColorPickerHue />
                            <ColorPickerFormat />
                          </ColorPicker>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Exp.</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
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
                      <Textarea placeholder="Brief description..." rows={3} {...field} />
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
                      <FormDescription>Show this skill on your portfolio</FormDescription>
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
        title="Delete Skill"
        description="Are you sure you want to delete this skill?"
        open={isDialogDeleteOpen}
        onOpenChange={(open) => setIsDialogDeleteOpen(open)}
        onConfirm={() => handleDelete(deletingId!)}
        onCancel={() => setIsDialogDeleteOpen(false)}
      />
    </div>
  );
}
