import { Skill } from '@prisma/client';
import {
    parseToProficiencyLevel,
    parseToSkillCategory,
    ProficiencyLevelEnum,
    SkillCategoryEnum,
} from '../../constants';
import { SkillFormValues } from './schema';

export const toSkillFormValues = (skill: Skill): SkillFormValues => {
  return {
    name: skill.name,
    proficiency: parseToProficiencyLevel(skill.proficiency, ProficiencyLevelEnum.BEGINNER),
    category: parseToSkillCategory(skill.category, SkillCategoryEnum.FRONTEND),
    displayOrder: skill.displayOrder,
    isVisible: skill.isVisible,
    iconId: skill.iconId,
    description: skill.description,
    yearsOfExperience: skill.yearsOfExperience,
  };
};
