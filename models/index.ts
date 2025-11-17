// Export all models centrally to ensure proper mongoose registration
import Comment from './Comment';
import Education from './Education';
import Experience from './Experience';
import Image from './Image';
import Post from './Post';
import Profile from './Profile';
import Project from './Project';
import SiteSettings from './SiteSettings';
import Skill from './Skill';
import Tag from './Tag';
import User from './User';

// Re-export all models
export { Comment, Education, Experience, Image, Post, Profile, Project, SiteSettings, Skill, Tag, User };

// Also export the interfaces
export type { IComment } from './Comment';
export type { IEducation } from './Education';
export type { IExperience } from './Experience';
export type { IImage } from './Image';
export type { IPost, IPostResponse } from './Post';
export type { IProfile } from './Profile';
export type { IProject, ProjectStatus, ProjectType } from './Project';
export type { ISiteSettings } from './SiteSettings';
export type { ISkill, ProficiencyLevel, SkillCategory } from './Skill';
export type { ITag } from './Tag';
export type { IUser } from './User';

// Default export as an object containing all models
const models = {
  Comment,
  Education,
  Experience,
  Image,
  Post,
  Profile,
  Project,
  Skill,
  SiteSettings,
  Tag,
  User,
};

export default models;
