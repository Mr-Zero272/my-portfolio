import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ISkill } from '@/models';
import { motion } from 'motion/react';

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

const SkillsTab = ({ skills }: { skills: ISkill[] }) => {
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
          {skills.map((skill) => (
            <motion.li variants={cardVariants} whileHover="hover">
              <Card key={skill._id.toString()} className="group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    {skill.icon ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="h-10 w-10 rounded-md object-contain"
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
                      <Badge variant="secondary">{skill.yearsOfExperience} years</Badge>
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
