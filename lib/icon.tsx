import { Facebook, Github, Linkedin, Youtube } from '@/components/icons';
import { cn } from './utils';

export const renderIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'github':
      return <Github className={cn('size-4', className)} />;
    case 'youtube':
      return <Youtube className={cn('size-4', className)} />;
    case 'linkedin':
      return <Linkedin className={cn('size-4', className)} />;
    case 'facebook':
      return <Facebook className={cn('size-4', className)} />;
    // Add more icons here as needed
    default:
      return null;
  }
};
