'use client';
import {
    Angular,
    Apachekafka,
    Cobol,
    Java,
    Javascript,
    Microsoftsqlserver,
    Mongodb,
    Mysql,
    Nextjs,
    React,
    Redis,
    Spring,
    SpringSecurity,
    Typescript,
} from '@/components/icons';
import CopyToClipBoardButton from '@/components/ui/copy-to-clipboard-button';
import CustomCheckbox from '@/components/ui/custom-checkbox';
import { aboutTabs } from '@/constants/about-tabs';
import { Dot } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type TabType = 'about' | 'education' | 'skills' | 'experiences';

function Resume() {
    const [activeTab, setActiveTab] = useState<TabType>('about');

    const handleChangeTab = (tab: string) => {
        setActiveTab(tab as TabType);
    };
    return (
        <section className="flex flex-col gap-24 p-5 sm:p-10 lg:flex-row">
            <article className="relative flex w-full flex-col md:flex-row lg:w-96 lg:flex-col">
                <h1 className="z-[1] block w-full text-4xl font-bold sm:text-4xl md:w-1/2 lg:w-full lg:text-6xl">
                    All over my details find here...
                </h1>
                <div className="absolute -left-3 -top-4 z-0 size-12 rounded-full bg-primary sm:size-16 lg:size-20"></div>
                <div className="mt-10 flex flex-1 flex-row flex-wrap gap-3 md:flex-col">
                    {aboutTabs.map((tab) => (
                        <CustomCheckbox
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                            active={activeTab === tab.value}
                            onCheck={handleChangeTab}
                        />
                    ))}
                </div>
            </article>
            <article className="flex-1">
                {activeTab === 'about' && (
                    <>
                        <h1 className="mb-3 text-2xl font-bold tracking-wider">Base in Vietnam</h1>
                        <p className="mb-7 text-gray-500">
                            I&apos;m a developer skilled in front-end and back-end technologies, specializing in dynamic
                            web applications with JavaScript, TypeScript, ReactJS, and Next.js. On the back end, I excel
                            in Java, Spring Boot, and microservices architecture, with experience in Kafka, Redis,
                            database design, and API development. I&apos;m committed to delivering high-quality web
                            solutions.
                        </p>
                        <ul>
                            <li className="mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">Name</p>
                                <p className="text-base font-semibold md:text-xl">Thuong Phan Thanh</p>
                            </li>
                            <li className="mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">Nationality</p>
                                <p className="text-base font-semibold md:text-xl">Vietnam</p>
                            </li>
                            <li className="group mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">Phone</p>
                                <p className="text-base font-semibold md:text-xl">(+84) 395 570 930</p>
                                <CopyToClipBoardButton text="0395570930" />
                            </li>
                            <li className="group mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">Email</p>
                                <p className="overflow-hidden text-ellipsis text-base font-semibold md:text-xl">
                                    pitithuong@gmail.com
                                </p>
                                <CopyToClipBoardButton text="pitithuong@gmail.com" />
                            </li>
                            <li className="mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">Freelance</p>
                                <p className="text-base font-semibold md:text-xl">Available</p>
                            </li>
                            <li className="group mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">LinkedIn</p>
                                <Link
                                    href="https://www.linkedin.com/in/mr-zero272/"
                                    className="text-base font-semibold text-primary hover:underline md:text-xl"
                                >
                                    Go to my LinkedIn
                                </Link>
                                <CopyToClipBoardButton text="https://www.linkedin.com/in/mr-zero272/" />
                            </li>
                            <li className="mb-2 flex">
                                <p className="w-28 text-gray-600 md:w-40">Language</p>
                                <p className="text-base font-semibold md:text-xl">Vietnamese, English</p>
                            </li>
                        </ul>
                    </>
                )}
                {activeTab === 'education' && (
                    <>
                        <h1 className="mb-3 text-2xl font-bold tracking-wider">Education</h1>
                        <p className="mb-7 text-gray-500">
                            Below are details of my university studies as well as information about the short courses I
                            attended.
                        </p>
                        <ul>
                            <li className="group flex cursor-pointer flex-col gap-3 rounded-md border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg md:flex-row md:gap-10">
                                <p className="text-right transition-all duration-300 ease-in-out group-hover:text-primary md:text-left">
                                    08/2020 – 12/2024
                                </p>
                                <div>
                                    <div className="flex">
                                        <Dot className="size-7 text-primary" />
                                        <p>CTU</p>
                                    </div>
                                    <h2 className="ms-2 text-xl font-bold">Bachelor of Information Technology</h2>
                                </div>
                            </li>
                        </ul>
                    </>
                )}
                {activeTab === 'skills' && (
                    <>
                        <h1 className="mb-2 text-2xl font-bold tracking-wider">Skills</h1>
                        <p className="mb-7 text-gray-500">
                            Below are the skills, technologies and programming languages ​​I am proficient in.
                        </p>
                        <div className="max-h-[380px] overflow-y-auto pb-10">
                            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-[#087ea4]">
                                        <React className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">React</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-red-500">
                                        <Angular className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Angular</h3>
                                        <p className="">Intermediate.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-gray-900">
                                        <Nextjs className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Next.js</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-primary">
                                        <Spring className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Spring Boot</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-primary">
                                        <SpringSecurity className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Spring Security</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-gray-900">
                                        <Apachekafka className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Apache Kafka</h3>
                                        <p className="">Intermediate.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-red-500">
                                        <Redis className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Redis</h3>
                                        <p className="">Intermediate.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-[#f7df1e]">
                                        <Javascript className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Javascript</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-[#3178c6]">
                                        <Typescript className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Typescript</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-red-500">
                                        <Java className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Java</h3>
                                        <p className="">Proficient.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-[#8aadf4]">
                                        <Cobol className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Cobol</h3>
                                        <p className="">Intermediate.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-green-600">
                                        <Mongodb className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Mongodb</h3>
                                        <p className="">Database.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-[#5797b2]">
                                        <Mysql className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Mysql</h3>
                                        <p className="">Database.</p>
                                    </div>
                                </li>
                                <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
                                    <p className="transition-all duration-300 ease-in-out group-hover:text-[#c0595d]">
                                        <Microsoftsqlserver className="size-10" />
                                    </p>
                                    <div>
                                        <h3 className="text-xl font-bold">Sql server</h3>
                                        <p className="">Database.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
                {activeTab === 'experiences' && (
                    <>
                        <h1 className="mb-2 text-2xl font-bold tracking-wider">Experiences</h1>
                        <p className="mb-7 text-gray-500">My experiences...</p>
                        <div className="max-h-[380px] overflow-y-auto pb-10">
                            <ul>
                                <li className="group flex cursor-pointer flex-col gap-3 rounded-md border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg md:flex-row md:gap-10">
                                    <p className="text-right transition-all duration-300 ease-in-out group-hover:text-primary md:text-left">
                                        05/2024 – 07/2024
                                    </p>
                                    <div>
                                        <div className="flex">
                                            <Dot className="size-7 text-primary" />
                                            <p>Fujinet System company</p>
                                        </div>
                                        <h2 className="ms-2 text-xl font-bold">Internship</h2>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </article>
        </section>
    );
}

export default Resume;
