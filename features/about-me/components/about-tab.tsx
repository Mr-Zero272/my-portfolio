import CopyToClipBoardButton from '@/components/ui/copy-to-clipboard-button';
import Link from 'next/link';

const AboutTab = () => {
  return (
    <div>
      <>
        <h1 className="mb-3 text-2xl font-bold tracking-wider">Base in Vietnam</h1>
        <p className="mb-7 text-gray-500">
          I&apos;m a developer skilled in front-end and back-end technologies, specializing in dynamic web applications
          with JavaScript, TypeScript, ReactJS, and Next.js. On the back end, I excel in Java, Spring Boot, and
          microservices architecture, with experience in Kafka, Redis, database design, and API development. I&apos;m
          committed to delivering high-quality web solutions.
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
            <p className="overflow-hidden text-base font-semibold text-ellipsis md:text-xl">pitithuong@gmail.com</p>
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
              className="text-primary text-base font-semibold hover:underline md:text-xl"
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
    </div>
  );
};

export default AboutTab;
