'use client';

import { profileApi } from '@/apis/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await profileApi.getProfile();

        if (response.profile) {
          form.reset({
            name: response.profile.name || '',
            tagline: response.profile.tagline || '',
            bio: response.profile.bio || '',
            description: response.profile.description || '',
            phone: response.profile.phone || '',
            nationality: response.profile.nationality || '',
            address: response.profile.address || '',
            yoe: response.profile.yoe || 0,
            freelanceAvailable: response.profile.freelanceAvailable ?? true,
            languages: response.profile.languages || ['Vietnamese', 'English'],
            rotatingWords: response.profile.rotatingWords || ['Web', 'Software', 'Mainframe'],
            metaTitle: response.profile.metaTitle || '',
            metaDescription: response.profile.metaDescription || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [form]);

  // Handle form submission
  const onSubmit = useCallback(async (data: ProfileSettingsFormData) => {
    try {
      setSaving(true);

      await profileApi.updateProfile(data);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 px-3 pb-10">
      {/* Basic Information */}
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="border-b px-0">
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
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
                        <Input type="number" placeholder="Years of Experience" {...field} />
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
                    <FormDescription>A brief introduction about yourself</FormDescription>
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
                    <FormDescription>A longer, more detailed description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
