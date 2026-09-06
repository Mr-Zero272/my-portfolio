import { Education } from '@prisma/client';
import { EducationFormValues } from './schema';

export const toEducationFormValue = (values: Education): EducationFormValues => {
  return {
    institution: values.institution,
    degree: values.degree,
    fieldOfStudy: values.fieldOfStudy,
    startDate: new Date(values.startDate).toISOString(),
    endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
    description: values.description,
    location: values.location,
    displayOrder: values.displayOrder,
    isVisible: values.isVisible,
  };
};
