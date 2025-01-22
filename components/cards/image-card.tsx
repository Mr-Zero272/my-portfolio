import { ArrowRight, Dot, Scan } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { EyeCatchingButton_v3 } from '../animations/eye-catching-button_v3';

type Props = {
    imgSrc: string;
    tech: string;
    name: string;
    time: string;
    desc: string;
    link: string;
    className?: string;
};

const ImageCard = ({ imgSrc, tech, name, time, desc, link, className = '' }: Props) => {
    return (
        <figure className={`relative flex flex-col items-center justify-center ${className}`}>
            <Image
                src="https://i.pinimg.com/1200x/12/47/c0/1247c04845ac84a19cfe1d5b24028ab7.jpg"
                alt="project 1"
                className="z-[-10] size-72 object-cover shadow-lg"
                width={240}
                height={500}
                quality={100}
            />
            <div className="absolute top-2 flex w-full items-center justify-between px-10">
                <p className="text-gray-600">Nextjs</p>
                <button className="rounded-md p-1 text-gray-700 hover:text-black active:scale-90">
                    <Scan className="size-4" />
                </button>
            </div>
            <div className="z-10 h-72 w-80 rounded-xl bg-white p-10 shadow-lg">
                <div className="flex gap-x-2">
                    <p className="flex items-center font-medium">
                        <span>
                            <Dot className="size-6" />
                        </span>
                        <span>Project A</span>
                    </p>
                    <p className="flex items-center font-medium text-primary">
                        <span>
                            <Dot />
                        </span>
                        <span>03 May 2019</span>
                    </p>
                </div>
                <h1 className="text-2xl font-bold">Lorem ipsum dolor sit.</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor eaque quam beatae.</p>
                <Button variant="link">
                    Detail
                    <ArrowRight />
                </Button>
            </div>
        </figure>
    );
};

export default ImageCard;
