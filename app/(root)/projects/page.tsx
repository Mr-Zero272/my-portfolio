import ProjectCard from '@/components/cards/project-card/project-card';
import { projects } from '@/constants/projects-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects by Thuong Phan Thanh - Full Stack Developer',
    description:
        'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
    keywords: [
        'Thuong Phan Thanh projects',
        'React projects',
        'Next.js projects',
        'Angular projects',
        'Java Spring projects',
        'Full Stack projects',
        'web development portfolio',
        'JavaScript projects',
        'TypeScript projects',
        'open source',
        'GitHub projects',
    ],
    openGraph: {
        title: 'Projects by Thuong Phan Thanh - Full Stack Developer',
        description:
            'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
        url: 'https://pitithuong.vercel.app/projects',
        images: [
            {
                url: '/images/projects/portfolio/my-portfolio-h-4.png',
                width: 1200,
                height: 630,
                alt: 'Projects by Thuong Phan Thanh',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects by Thuong Phan Thanh - Full Stack Developer',
        description:
            'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
        images: ['/images/projects/portfolio/my-portfolio-h-4.png'],
    },
};

const ProjectPage = () => {
    return (
        <section className="p-5">
            <div className="mb-10 flex flex-col items-center justify-center">
                <h4 className="mb-3 font-semibold">MY PROJECTS</h4>
                <h1 className="mb-3 text-center text-2xl font-bold md:mb-5 md:text-5xl">What have I done?</h1>
                <p className="text-center text-sm text-muted-foreground md:w-2/3 md:text-base">
                    I&apos;m not just a developer, I&apos;m a digital dream weaver. Crafting immersive online
                    experiences is not just a job but my calling. Discover below how I can help you.
                </p>
            </div>

            <article className="space-y-10 px-4 md:px-10">
                {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                ))}
            </article>
        </section>
    );
};

export default ProjectPage;
