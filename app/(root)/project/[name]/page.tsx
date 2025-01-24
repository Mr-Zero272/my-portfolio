import React from 'react';

type Props = {
    params: Promise<{ name: string }>;
};

const ProjectDetailPage = async ({ params }: Props) => {
    const id = (await params).name;
    return <div>ProjectDetailPage {id}</div>;
};

export default ProjectDetailPage;
