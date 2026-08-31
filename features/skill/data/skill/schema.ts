import { z } from 'zod';
import { ProficiencyLevelEnum, SkillCategoryEnum } from '../../constants';

export const SkillFormSchema = z.object({
  name: z.string().trim().min(1, "Skill name can't be empty."),
  proficiency: z.enum(ProficiencyLevelEnum),
  category: z.enum(SkillCategoryEnum),
  iconId: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  yearsOfExperience: z.number().nullable().optional(),
  displayOrder: z.number(),
  isVisible: z.boolean(),
});

export type SkillFormValues = z.infer<typeof SkillFormSchema>;

export const DEFAULT_SKILL_FORM_VALUES: SkillFormValues = {
  name: '',
  proficiency: ProficiencyLevelEnum.BEGINNER,
  category: SkillCategoryEnum.FRONTEND,
  iconId: null,
  description: null,
  yearsOfExperience: null,
  displayOrder: 0,
  isVisible: true,
};

export const BulkSortItemSchema = z.object({
  id: z.string(),
  displayOrder: z.number().int(),
});

export const BulkSortSkillsSchema = z.object({
  items: z.array(BulkSortItemSchema),
});

export type BulkSortSkillsInput = z.infer<typeof BulkSortSkillsSchema>;

