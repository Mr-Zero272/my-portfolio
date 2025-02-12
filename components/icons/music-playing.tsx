import React from 'react';
import type { SVGProps } from 'react';

export function MusicPlaying(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
            <rect width={2.8} height={12} x={1} y={6} fill="currentColor">
                <animate
                    attributeName="y"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="6;1;6"
                ></animate>
                <animate
                    attributeName="height"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="12;22;12"
                ></animate>
            </rect>
            <rect width={2.8} height={12} x={5.8} y={6} fill="currentColor">
                <animate
                    attributeName="y"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="6;1;6"
                ></animate>
                <animate
                    attributeName="height"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="12;22;12"
                ></animate>
            </rect>
            <rect width={2.8} height={12} x={10.6} y={6} fill="currentColor">
                <animate
                    id="svgSpinnersBarsScaleMiddle0"
                    attributeName="y"
                    begin="0;svgSpinnersBarsScaleMiddle1.end-0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="6;1;6"
                ></animate>
                <animate
                    attributeName="height"
                    begin="0;svgSpinnersBarsScaleMiddle1.end-0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="12;22;12"
                ></animate>
            </rect>
            <rect width={2.8} height={12} x={15.4} y={6} fill="currentColor">
                <animate
                    attributeName="y"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="6;1;6"
                ></animate>
                <animate
                    attributeName="height"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="12;22;12"
                ></animate>
            </rect>
            <rect width={2.8} height={12} x={20.2} y={6} fill="currentColor">
                <animate
                    id="svgSpinnersBarsScaleMiddle1"
                    attributeName="y"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="6;1;6"
                ></animate>
                <animate
                    attributeName="height"
                    begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                    values="12;22;12"
                ></animate>
            </rect>
        </svg>
    );
}

export default MusicPlaying;
