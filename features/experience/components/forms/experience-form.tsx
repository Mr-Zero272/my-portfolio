'use client';

import {
  FormDatePicker,
  FormGalleryInput,
  FormInput,
  FormNumber,
  FormRichText,
  FormSelect,
  FormSwitch,
  FormTagsInput,
} from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryImage } from '@prisma/client';
import { AlertCircleIcon, ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { EXPERIENCE_POSITION_ICON_TYPE_OPTIONS } from '../../constants';
import {
  DEFAULT_EXPERIENCE_FORM_VALUES,
  ExperienceFormSchema,
  ExperienceFormValues,
} from '../../data';

export const ExperienceForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
  context,
}: BaseFormProps<ExperienceFormValues, { companyLogo?: GalleryImage }>) => {
  const id = useId();
  const formId = `experience-form-${id}`;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(ExperienceFormSchema),
    defaultValues: initialData || DEFAULT_EXPERIENCE_FORM_VALUES,
    mode: 'onTouched',
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'positions',
  });

  const isLocalSubmitting = form.formState.isSubmitting || isSubmitting || false;

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col space-y-2', className)}>
      <FormProvider {...form}>
        {serverErrors?.root && (
          <div className="px-4">
            <Alert variant="error">
              <AlertCircleIcon className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverErrors.root}</AlertDescription>
            </Alert>
          </div>
        )}

        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <FieldGroup className="scroll-fade min-h-0 flex-1 scrollbar-none overflow-x-hidden overflow-y-auto px-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                name="companyName"
                label="Company Name"
                required
                placeholder="eg: Google..."
              />
              <FormInput
                name="companyWebsite"
                label="Company Website"
                placeholder="eg: https://google.com"
              />
            </div>

            <FormGalleryInput
              name="companyLogoId"
              label="Company Logo"
              accept="image/*"
              multiple={false}
              existing={context?.companyLogo}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSwitch
                name="isCurrentEmployer"
                label="Is Current Employer"
                description="Turn on if this is your current employer"
              />

              <FormSwitch
                name="isVisible"
                label="Is Visible"
                description="Turn off to hide it from the public page"
              />
            </div>

            <FormNumber name="displayOrder" label="Display Order" min={0} step={1} />

            {/* Positions Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Positions</h3>
                  <p className="text-muted-foreground text-xs">
                    Manage positions held at this company.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      title: '',
                      employmentType: '',
                      location: '',
                      startDate: new Date().toISOString(),
                      endDate: null,
                      description: '',
                      icon: null,
                      skills: [],
                    })
                  }
                >
                  <PlusIcon />
                  Add Position
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-muted-foreground rounded-lg border-2 border-dashed p-6 text-center text-sm">
                  No positions added yet. Click &quot;Add Position&quot; to add your first role.
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((fieldItem, index) => (
                    <Card key={fieldItem.id} className="relative pt-0">
                      <CardHeader className="bg-muted/30 flex flex-row items-center justify-between py-2">
                        <CardTitle className="text-sm font-medium">
                          Position #{index + 1}
                          {form.watch(`positions.${index}.title`)
                            ? `: ${form.watch(`positions.${index}.title`)}`
                            : ''}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => move(index, index - 1)}
                            title="Move up"
                          >
                            <ArrowUpIcon className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={index === fields.length - 1}
                            onClick={() => move(index, index + 1)}
                            title="Move down"
                          >
                            <ArrowDownIcon className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            title="Remove position"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormInput
                            name={`positions.${index}.title`}
                            label="Position Title"
                            required
                            placeholder="eg: Senior Full Stack Engineer"
                          />
                          <FormSelect
                            name={`positions.${index}.icon`}
                            label="Icon Type"
                            placeholder="Select icon"
                            options={EXPERIENCE_POSITION_ICON_TYPE_OPTIONS}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormInput
                            name={`positions.${index}.employmentType`}
                            label="Employment Type"
                            placeholder="eg: Full-time, Contract..."
                          />
                          <FormInput
                            name={`positions.${index}.location`}
                            label="Location"
                            placeholder="eg: Remote / San Francisco, CA"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormDatePicker
                            name={`positions.${index}.startDate`}
                            label="Start Date"
                            required
                          />
                          <FormDatePicker
                            name={`positions.${index}.endDate`}
                            label="End Date"
                            placeholder="Present"
                            description="Leave empty if current role"
                          />
                        </div>

                        <FormRichText
                          name={`positions.${index}.description`}
                          label="Description"
                          placeholder="Describe your responsibilities and achievements..."
                        />

                        <FormTagsInput
                          name={`positions.${index}.skills`}
                          label="Skills & Technologies"
                          placeholder="Type skill and press Enter or comma..."
                          description="Add skills or tools used in this role."
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </FieldGroup>

          {renderSubmitPart?.({ isSubmitting: !!isLocalSubmitting, formId }) ?? (
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={!!isLocalSubmitting}>
                {isLocalSubmitting
                  ? 'Submitting...'
                  : isEditMode
                    ? 'Update Experience'
                    : 'Create Experience'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
