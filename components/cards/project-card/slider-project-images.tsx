'use client';

import React, { useMemo, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import Image from 'next/image';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { cn } from '@/lib/utils';

type Props = {};

const imageUrls = [
    'https://i.pinimg.com/1200x/d7/c1/22/d7c1222dac77cb41d8d7f8626952d606.jpg',
    'https://i.pinimg.com/1200x/19/c7/d2/19c7d201f126826649d6f9c12a44d0e2.jpg',
    'https://i.pinimg.com/1200x/7b/bc/51/7bbc51ffd1a763a8f6ce57e4c79cf67e.jpg',
    'https://i.pinimg.com/1200x/81/5e/05/815e0562e3a558b1b364937d8e5c91e2.jpg',
];

const SliderProjectImages = (props: Props) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef<Slider | null>(null);

    const settings: Settings = useMemo<Settings>(
        () => ({
            autoplay: true,
            autoplaySpeed: 5000,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            beforeChange: (_, next: number) => setActiveSlide(next),
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1,
                    },
                },
            ],
        }),
        [],
    );
    return (
        <div className="flex flex-col lg:flex-row">
            <div className="w-full items-start lg:w-[350px]">
                <Slider {...settings} ref={sliderRef}>
                    {imageUrls.map((url, index) => (
                        <div key={index}>
                            <Image
                                src={url}
                                alt="project 1"
                                className="z-[-10] h-[34rem] w-full rounded-2xl p-0 sm:p-2 lg:rounded-l-xl lg:p-0"
                                width={240}
                                height={500}
                                quality={100}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="flex h-full flex-1 items-center justify-center gap-1 pt-4 lg:flex-col lg:justify-start lg:pt-10">
                {Array.from({ length: 4 }, (_, index) => (
                    <div
                        key={index}
                        className={cn(
                            'size-3 cursor-pointer rounded-sm border border-muted-foreground transition-all duration-300 ease-in-out',
                            {
                                'h-3 w-6 border-primary bg-primary lg:h-6 lg:w-3': index === activeSlide,
                            },
                        )}
                        onClick={() => sliderRef.current?.slickGoTo(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SliderProjectImages;
