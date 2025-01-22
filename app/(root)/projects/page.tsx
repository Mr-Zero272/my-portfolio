import ProjectCard from '@/components/cards/project-card';

const ProjectPage = () => {
    return (
        <section className="p-5">
            <article className="mb-8 flex flex-col justify-between gap-10 px-5 xl:flex-row">
                <div className="mb-5 flex flex-1 flex-col">
                    <h4 className="mb-3 font-semibold">MY PROJECTS</h4>
                    <h1 className="mb-5 w-[23rem] text-6xl font-bold">What have I done?</h1>
                    <p className="text-gray-500">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe voluptate facere vitae autem
                        quam excepturi blanditiis eius inventore nisi assumenda!
                    </p>
                </div>
                <div className="flex min-h-60 flex-1 flex-col justify-between bg-black p-10 text-white xl:min-h-0">
                    <div className="flex flex-col items-start">
                        <div className="h-0.5 w-36 bg-white"></div>
                        <h1 className="text-3xl font-medium text-white">Project Summary</h1>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <p className="w-20 text-center">Lorem, ipsum dolor.</p>
                        <p className="w-20 text-center">Lorem, ipsum dolor.</p>
                        <p className="w-20 text-center">Lorem, ipsum dolor.</p>
                    </div>
                </div>
            </article>
            <article className="grid grid-cols-1 place-items-center gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </article>
        </section>
    );
};

export default ProjectPage;
