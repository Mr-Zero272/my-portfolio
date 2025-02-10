import { Metadata } from 'next';
import Resume from './resume';

export const metadata: Metadata = {
    title: 'About me - @pitithuong',
    description: 'This page contain all basic information about pitithuong',
};

const AboutMePage = () => {
    return (
        <>
            <Resume />
        </>
    );
};

export default AboutMePage;
