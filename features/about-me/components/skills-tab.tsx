import { skillsApi } from '@/apis/skills';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ISkill } from '@/models';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import Image from 'next/image';

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

const SkillsTab = () => {
  const { data: skills = [], isLoading } = useQuery<ISkill[]>({
    queryKey: ['skills', 'list', { owner: true }],
    queryFn: () => skillsApi.getAll({ owner: true }),
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Skills</h1>
      <p className="mb-7 text-gray-500">
        Below are the skills, technologies and programming languages ​​I am proficient in.
      </p>
      <div className="max-h-[365px] overflow-y-auto pb-10">
        <motion.ul
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10" />
                    <div>
                      <Skeleton className="mb-2 h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="size-8" />
                </CardHeader>
                <CardContent>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}

          {skills.map((skill) => (
            <motion.li variants={cardVariants} whileHover="hover" key={skill._id.toString()}>
              <Card className="group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    {skill.icon ? (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-contain"
                        unoptimized
                        // style={{ backgroundColor: skill.iconColor ? `${skill.iconColor}20` : 'transparent' }}
                      />
                    ) : (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-lg font-bold"
                        style={{ color: skill.iconColor }}
                      >
                        {skill.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base font-medium">{skill.name}</CardTitle>
                      <CardDescription className="text-xs">{skill.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <Badge variant="secondary">{skill.proficiency}</Badge>
                    {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                      <Badge variant="secondary">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default SkillsTab;
