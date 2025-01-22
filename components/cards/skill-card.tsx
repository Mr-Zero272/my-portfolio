import React from 'react';

type Props = {
    icon: React.FC<{ className?: string }>;
    title: string;
    sub: string;
    className?: string;
};

const SkillCard = ({ icon: Icon, title, sub, className = '' }: Props) => {
    return (
        <div className={`flex flex-col items-center text-center ${className}`}>
            <div className="mb-4 rounded-full bg-black p-2.5">
                <Icon className="size-6 text-white" />
            </div>
            <h3 className="mb-2 font-bold">{title}</h3>
            <p className="text-gray-500">{sub}</p>
        </div>
    );
};

export default SkillCard;
