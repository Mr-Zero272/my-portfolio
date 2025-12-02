import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IEducation } from '@/models';
import { format } from 'date-fns';
import { CalendarIcon, GraduationCap, MapPin, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface EducationTabProps {
  educations: IEducation[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: {
    y: -5,
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const EducationTab = ({ educations }: EducationTabProps) => {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold tracking-wider">Education</h1>
      <p className="mb-7 text-gray-500">
        Below are details of my university studies as well as information about the short courses I attended.
      </p>
      <motion.ul variants={containerVariants} initial="hidden" animate="visible">
        {educations.map((education) => (
          <motion.li variants={cardVariants} whileHover="hover">
            <Card key={education._id.toString()}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold">{education.institution}</CardTitle>
                    <CardDescription className="text-xs">
                      {education.degree} {education.fieldOfStudy && `- ${education.fieldOfStudy}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {format(new Date(education.startDate), 'MMM yyyy')} -{' '}
                      {education.endDate ? format(new Date(education.endDate), 'MMM yyyy') : 'Present'}
                    </span>
                  </div>
                  {education.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{education.location}</span>
                    </div>
                  )}
                </div>
                {education.description && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{education.description}</p>
                )}
              </CardContent>
              <CardFooter>
                {!education.isVisible && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Hidden
                  </span>
                )}
              </CardFooter>
            </Card>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default EducationTab;
