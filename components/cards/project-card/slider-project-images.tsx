import Image from 'next/image';
import React from 'react';

type Props = {};

const SliderProjectImages = (props: Props) => {
    return (
        <div className="flex flex-col lg:flex-row">
            <div className="flex-1 items-start">
                <Image
                    src="https://i.pinimg.com/1200x/d7/c1/22/d7c1222dac77cb41d8d7f8626952d606.jpg"
                    alt="project 1"
                    className="z-[-10] h-[34rem] w-full rounded-2xl lg:rounded-l-xl"
                    width={240}
                    height={500}
                    quality={100}
                />
            </div>
            <div className="flex h-full items-center justify-center gap-2 pt-4 lg:w-10 lg:flex-col lg:justify-start lg:pt-10">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="size-3 cursor-pointer rounded-sm border border-muted-foreground"></div>
                ))}
            </div>
        </div>
    );
};

export default SliderProjectImages;
