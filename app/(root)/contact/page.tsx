import ContactForm from '@/components/forms/contact-form';
import { Github, Linkedin, Youtube } from '@/components/icons';
import { Mail, MapPin, PhoneCall } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Thuong Phan Thanh - Hire Full Stack Developer',
    description:
        'Ready to collaborate? Contact me for full stack development projects, freelance work, or job opportunities. Specialized in Next.js, React, Angular, Java Spring.',
    keywords: [
        'contact Thuong Phan Thanh',
        'hire full stack developer',
        'freelance developer',
        'web development services',
        'Next.js developer for hire',
        'React developer for hire',
        'Angular developer for hire',
        'Java Spring developer',
        'remote developer',
        'Vietnam developer',
        'collaboration',
        'job opportunities',
    ],
    openGraph: {
        title: 'Contact Thuong Phan Thanh - Hire Full Stack Developer',
        description:
            'Ready to collaborate? Contact me for full stack development projects, freelance work, or job opportunities. Specialized in Next.js, React, Angular, Java Spring.',
        url: 'https://pitithuong.vercel.app/contact',
        images: [
            {
                url: '/images/projects/portfolio/my-portfolio-h-3.png',
                width: 1200,
                height: 630,
                alt: 'Contact Thuong Phan Thanh',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Thuong Phan Thanh - Hire Full Stack Developer',
        description:
            'Ready to collaborate? Contact me for full stack development projects, freelance work, or job opportunities. Specialized in Next.js, React, Angular, Java Spring.',
        images: ['/images/projects/portfolio/my-portfolio-h-3.png'],
    },
};

const ContactPage = () => {
    return (
        <section className="flex flex-col gap-x-5 lg:flex-row">
            <article className="relative flex-1 p-5 lg:p-10">
                <h4 className="mb-2 text-sm font-semibold">CONTACT</h4>
                <h1 className="z-20 mb-2 block w-full text-3xl font-bold md:text-6xl">
                    Let&apos;s start a project together
                </h1>
                <p className="mb-10 text-gray-500">
                    You can contact me through the form beside, I look forward to cooperating and working with you.
                </p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-x-3 border-b pb-3">
                        <div className="p-2">
                            <Mail className="size-7" strokeWidth={1} />
                        </div>
                        <div className="group">
                            <p className="text-gray-500">Email me</p>
                            <p className="font-semibold">pitithuong@gmail.com</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-x-3 border-b pb-3">
                        <div className="p-2">
                            <PhoneCall className="size-7" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="text-gray-500">Call me</p>
                            <p className="font-semibold">(+84) 395 570 930</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-x-3 border-b pb-3">
                        <div className="p-2">
                            <MapPin className="size-7" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="text-gray-500">My address</p>
                            <p className="font-semibold">Can Tho, Vietnam</p>
                        </div>
                    </li>
                </ul>
            </article>
            <article className="flex-1 px-5 md:px-20 lg:mt-12 lg:p-5 lg:px-10">
                <ContactForm className="mb-20" />
                <div className="mb-10 hidden flex-wrap items-center gap-x-5 xl:flex">
                    <div className="h-0.5 w-20 bg-black dark:bg-white"></div>
                    <p className="text-xl font-bold">Follow me</p>
                    <ul className="flex items-center">
                        <li className="group p-2">
                            <Link href="https://www.linkedin.com/in/mr-zero272/">
                                <Linkedin className="size-6 group-hover:text-blue-700" />
                            </Link>
                        </li>
                        <li className="p-2">
                            <Link href="https://github.com/Mr-Zero272/">
                                <Github className="size-6" />
                            </Link>
                        </li>
                        <li className="group p-2">
                            <Link href="https://www.youtube.com/@MoonCoder-o3v">
                                <Youtube className="size-6 group-hover:text-red-500" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </article>
        </section>
    );
};

export default ContactPage;
