'use client';

import { experienceApi } from '@/apis/experience';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  BriefcaseBusinessIcon,
  CalendarIcon,
  CodeXmlIcon,
  DraftingCompassIcon,
  GraduationCapIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Validation schema
const positionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  employmentType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional(),
  description: z.string().optional(),
  icon: z.enum(['code', 'design', 'business', 'education']).optional(),
  skills: z.array(z.string()).optional(),
});

const experienceSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  companyLogo: z.string().optional(),
  isCurrentEmployer: z.boolean().optional(),
  positions: z.array(positionSchema).optional(),
  isVisible: z.boolean().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

const iconOptions = [
  { value: 'code', label: 'Code', icon: CodeXmlIcon },
  { value: 'design', label: 'Design', icon: DraftingCompassIcon },
  { value: 'business', label: 'Business', icon: BriefcaseBusinessIcon },
  { value: 'education', label: 'Education', icon: GraduationCapIcon },
];

const defaultSkills = [
  { label: 'React', value: 'React' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'TailwindCSS', value: 'TailwindCSS' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'GraphQL', value: 'GraphQL' },
  { label: 'Docker', value: 'Docker' },
  { label: 'AWS', value: 'AWS' },
];

export function ExperienceSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      companyName: '',
      companyLogo: '',
      isCurrentEmployer: false,
      isVisible: true,
      positions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'positions',
  });

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch owner experiences
      const data = await experienceApi.getAll({ owner: true });
      setExperiences(data);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      toast.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      companyName: '',
      companyLogo: '',
      isCurrentEmployer: false,
      isVisible: true,
      positions: [
        {
          title: '',
          employmentType: 'Full-time',
          startDate: new Date(),
          icon: 'business',
          skills: [],
        },
      ],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (experience: any) => {
    setEditingId(experience._id);
    form.reset({
      companyName: experience.companyName,
      companyLogo: experience.companyLogo || '',
      isCurrentEmployer: experience.isCurrentEmployer,
      isVisible: experience.isVisible,
      positions: experience.positions.map((pos: any) => ({
        ...pos,
        startDate: new Date(pos.startDate),
        endDate: pos.endDate ? new Date(pos.endDate) : undefined,
      })),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      await experienceApi.delete(id);
      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setSaving(true);
      // Format data for API
      const apiData: any = {
        ...data,
        positions: data.positions?.map((pos) => ({
          ...pos,
          startDate: pos.startDate.toISOString(),
          endDate: pos.endDate ? pos.endDate.toISOString() : undefined,
        })),
      };

      if (editingId) {
        await experienceApi.update(editingId, apiData);
        toast.success('Experience updated successfully');
      } else {
        await experienceApi.create(apiData);
        toast.success('Experience created successfully');
      }

      setIsDialogOpen(false);
      fetchExperiences();
    } catch (error) {
      console.error('Failed to save experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:pr-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Work Experience</h2>
          <p className="text-muted-foreground text-sm">Manage your work history and positions.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <Card key={experience._id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                  {experience.companyLogo ? (
                    <img
                      src={experience.companyLogo}
                      alt={experience.companyName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <BriefcaseBusinessIcon className="text-muted-foreground h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{experience.companyName}</h3>
                  <p className="text-muted-foreground text-sm">
                    {experience.positions.length} position{experience.positions.length !== 1 ? 's' : ''}
                    {experience.isCurrentEmployer && ' • Current Employer'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(experience)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(experience._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {experiences.length === 0 && (
          <div className="text-muted-foreground py-12 text-center">No experiences found. Add one to get started.</div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <DialogDescription>Add details about your work experience. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="isCurrentEmployer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="mr-4 space-y-0.5">
                        <FormLabel>Current Employer</FormLabel>
                        <FormDescription>Is this your current workplace?</FormDescription>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="mr-4 space-y-0.5">
                        <FormLabel>Visible</FormLabel>
                        <FormDescription>Show on public profile?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Positions</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        title: '',
                        employmentType: 'Full-time',
                        startDate: new Date(),
                        icon: 'business',
                        skills: [],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Position
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive absolute top-2 right-2"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`positions.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Senior Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`positions.${index}.employmentType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Full-time">Full-time</SelectItem>
                                  <SelectItem value="Part-time">Part-time</SelectItem>
                                  <SelectItem value="Contract">Contract</SelectItem>
                                  <SelectItem value="Freelance">Freelance</SelectItem>
                                  <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`positions.${index}.startDate`}
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
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`positions.${index}.endDate`}
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
                                      {field.value ? format(field.value, 'PPP') : <span>Present</span>}
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
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`positions.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. San Francisco, CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`positions.${index}.icon`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icon</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {iconOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">
                                        <option.icon className="h-4 w-4" />
                                        <span>{option.label}</span>
                                      </div>
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
                        name={`positions.${index}.skills`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <MultiSelect
                                options={defaultSkills}
                                onValueChange={field.onChange}
                                defaultValue={field.value || []}
                                placeholder="Select skills"
                                variant="inverted"
                                animation={2}
                                maxCount={5}
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
                        name={`positions.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your role..." rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
