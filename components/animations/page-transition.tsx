'use client';

import PageTransitionAnimation from './page-transition-animation';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="z-10 min-h-[35rem] w-full">
            <PageTransitionAnimation />
            <div>{children}</div>
        </div>
    );
};

export default PageTransition;
