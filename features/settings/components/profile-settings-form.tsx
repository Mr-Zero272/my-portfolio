'use client';

import { profileApi } from '@/apis/profile';
import PulsingLoader from '@/components/shared/pulsing-loader';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const AVAILABLE_LANGUAGES = [
  'Vietnamese',
  'English',
  'Japanese',
  'Chinese',
  'French',
  'German',
  'Spanish',
  'Korean',
  'Russian',
];

// Validation schema
const profileSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  yoe: z.number().optional().default(0),
  tagline: z.string().optional().default(''),
  bio: z.string().optional().default(''),
  description: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  nationality: z.string().optional().default(''),
  address: z.string().optional().default(''),
  freelanceAvailable: z.boolean().optional().default(true),
  languages: z.array(z.string()).optional().default(['Vietnamese', 'English']),
  rotatingWords: z.array(z.string()).optional().default(['Web', 'Software', 'Mainframe']),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
});

type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

export function ProfileSettingsForm() {
  const [wordInput, setWordInput] = useState('');
  const langAnchor = useComboboxAnchor();

  const queryClient = useQueryClient();

  const { data: profileData, isLoading: loading } = useQuery({
    queryKey: ['profile', 'detail', { owner: true }],
    queryFn: () => profileApi.getProfile(),
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: (data: unknown) => profileApi.updateProfile(data as ProfileSettingsFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    },
  });

  const form = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: '',
      yoe: 0,
      tagline: '',
      bio: '',
      description: '',
      phone: '',
      nationality: '',
      address: '',
      freelanceAvailable: true,
      languages: ['Vietnamese', 'English'],
      rotatingWords: ['Web', 'Software', 'Mainframe'],
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (profileData?.profile) {
      form.reset({
        name: profileData.profile.name,
        yoe: profileData.profile.yoe,
        tagline: profileData.profile.tagline,
        bio: profileData.profile.bio,
        description: profileData.profile.description,
        phone: profileData.profile.phone,
        nationality: profileData.profile.nationality,
        address: profileData.profile.address,
        freelanceAvailable: profileData.profile.freelanceAvailable,
        languages: profileData.profile.languages,
        rotatingWords: profileData.profile.rotatingWords,
        metaTitle: profileData.profile.metaTitle,
        metaDescription: profileData.profile.metaDescription,
      });
    }
  }, [form, profileData]);

  // Handle form submission
  const onSubmit = useCallback(
    async (data: ProfileSettingsFormData) => {
      try {
        await updateProfile(data);
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      }
    },
    [updateProfile],
  );

  return (
    <div className="max-w-7xl space-y-6 px-3 pb-10">
      {/* Basic Information */}

      <div className="border-b px-0 pb-4">
        <h2 className="text-lg font-medium">Basic Information</h2>
        <p className="text-sm text-muted-foreground">Update your basic profile information</p>
      </div>
      <div className="px-0">
        {loading && (
          <div className="flex h-[600px] items-center justify-center">
            <PulsingLoader className="size-6" />
          </div>
        )}
        {!loading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="yoe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Years of Experience"
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nationality */}
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vietnamese" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tagline */}
              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Full Stack Developer" {...field} />
                    </FormControl>
                    <FormDescription>A short description of what you do</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Short biography" rows={3} {...field} />
                    </FormControl>
                    <FormDescription>A brief introduction about yourself.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Longer description about you" rows={4} {...field} />
                    </FormControl>
                    <FormDescription>
                      A longer, more detailed description. Recommended{' '}
                      <span
                        className={cn('font-medium', {
                          'text-destructive': Number(field?.value?.length) > 210,
                        })}
                      >
                        {field?.value?.length || 0}
                      </span>
                      /<span className="font-medium text-teal-600">210</span> characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Languages */}
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <Combobox
                          multiple
                          items={AVAILABLE_LANGUAGES}
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <ComboboxChips ref={langAnchor} className="w-full">
                            <ComboboxValue>
                              {(values: string[]) => (
                                <>
                                  {values.map((lang) => (
                                    <ComboboxChip key={lang}>{lang}</ComboboxChip>
                                  ))}
                                  <ComboboxChipsInput placeholder="Select languages..." />
                                </>
                              )}
                            </ComboboxValue>
                          </ComboboxChips>
                          <ComboboxContent anchor={langAnchor}>
                            <ComboboxEmpty>No language found.</ComboboxEmpty>
                            <ComboboxList>
                              {(lang: string) => (
                                <ComboboxItem key={lang} value={lang}>
                                  {lang}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </FormControl>
                      <FormDescription>The languages you can communicate in</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rotating Words */}
                <FormField
                  control={form.control}
                  name="rotatingWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rotating Words</FormLabel>
                      <div className="space-y-3">
                        <InputGroup>
                          <InputGroupInput
                            placeholder="Add a word..."
                            value={wordInput}
                            onChange={(e) => setWordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (wordInput.trim()) {
                                  const currentWords = field.value || [];
                                  if (!currentWords.includes(wordInput.trim())) {
                                    field.onChange([...currentWords, wordInput.trim()]);
                                  }
                                  setWordInput('');
                                }
                              }
                            }}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => {
                                if (wordInput.trim()) {
                                  const currentWords = field.value || [];
                                  if (!currentWords.includes(wordInput.trim())) {
                                    field.onChange([...currentWords, wordInput.trim()]);
                                  }
                                  setWordInput('');
                                }
                              }}
                            >
                              <Plus className="size-4" />
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>

                        <div className="flex flex-wrap gap-2">
                          {field.value?.map((word, index) => (
                            <div
                              key={index}
                              className={cn(badgeVariants({ variant: 'secondary' }), 'flex items-center gap-1 pr-1')}
                            >
                              {word}
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(field.value.filter((_, i) => i !== index));
                                }}
                                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <FormDescription>Words that will rotate in your hero section</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SEO Section */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-semibold">SEO Settings</h3>

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Page title for search engines" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description for search engines (max 160 characters)"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
