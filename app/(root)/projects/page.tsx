import ProjectCard from '@/components/cards/project-card/project-card';
import { projects } from '@/constants/projects-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects - @pitithuong',
    description: 'Browse my projects, including React, Next.js, and full-stack applications.',
    keywords: ['projects', 'portfolio', 'React', 'Next.js', 'web development'],
    openGraph: {
        title: 'Projects - @pitithuong',
        description: 'Browse my projects, including React, Next.js, and full-stack applications.',
        url: 'https://my-portfolio-rust-gamma-52.vercel.app/projects',
        images: [
            {
                url: '/images/projects/portfolio/my-portfolio-h-4.png',
                width: 1200,
                height: 630,
                alt: 'Projects Showcase',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects - @pitithuong',
        description: 'Browse my projects, including React, Next.js, and full-stack applications.',
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
