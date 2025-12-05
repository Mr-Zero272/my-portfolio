import { Github, Linkedin, Youtube } from '@/components/icons';
import { Mail, MapPin, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import ContactForm from './components/contact-form';

const ContactFeature = () => {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:gap-10">
      <article className="relative flex-1 p-5 lg:p-10">
        <h4 className="mb-2 text-sm font-semibold">CONTACT</h4>
        <h1 className="z-20 mb-2 block w-full text-3xl font-bold md:text-6xl">Let&apos;s start a project together</h1>
        <p className="mb-10 text-gray-500">
          You can contact me through the form beside, I look forward to cooperating and working with you.
        </p>
        <ul className="space-y-3">
          <li>
            <Link
              href="mailto:pitithuong@gmail.com"
              className="group flex cursor-pointer items-center gap-x-3 border-b pb-3 hover:border-primary"
            >
              <div className="relative size-8 p-2">
                <Mail
                  className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out group-hover:top-3"
                  strokeWidth={1}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email me</p>
                <p className="font-semibold">pitithuong@gmail.com</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              href="tel:+84395570930"
              className="group flex cursor-pointer items-center gap-x-3 border-b pb-3 hover:border-primary"
            >
              <div className="relative size-8 p-2">
                <PhoneCall
                  className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out group-hover:top-3"
                  strokeWidth={1}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Call me</p>
                <p className="font-semibold">(+84) 395 570 930</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              href="https://www.google.com/maps/place/Can+Tho,+Vietnam"
              className="group flex cursor-pointer items-center gap-x-3 border-b pb-3 hover:border-primary"
            >
              <div className="relative size-8 p-2">
                <MapPin
                  className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out group-hover:top-3"
                  strokeWidth={1}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My address</p>
                <p className="font-semibold">Can Tho, Vietnam</p>
              </div>
            </Link>
          </li>
        </ul>
      </article>
      <article className="flex-1 px-5 lg:mt-12 lg:p-5 lg:px-5">
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

export default ContactFeature;
