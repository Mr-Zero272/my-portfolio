const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128];

export const projects = [
    {
        id: '001',
        name: 'Movie online ticket booking',
        images: {
            vertical: [
                '/images/projects/movie/movie-v-1.png',
                '/images/projects/movie/movie-v-2.png',
                '/images/projects/movie/movie-v-3.png',
                '/images/projects/movie/movie-v-4.png',
            ],
            horizontal: [
                '/images/projects/movie/movie-h-1.png',
                '/images/projects/movie/movie-h-2.png',
                '/images/projects/movie/movie-h-3.png',
                '/images/projects/movie/movie-h-4.png',
            ],
        },
        type: 'website',
        status: 'developing',
        description:
            'The project simulates real-life movie ticket sales, using Spring boot with microservices architecture, Nextjs, Angular, Mongodb and MySql to provide a user-friendly, easy-to-use and high-performance website. Combined with techniques using Kafka and websocket to simulate the seat selection process in real time. Apply Jwt for application security',
        responsibilities: 'design and implement the entire project yourself',
        technologies: ['Next.js', 'Angular', 'Spring Boot', 'Spring Security', 'Kafka', 'Redis'],
        database: ['MongoDB', 'MySql'],
        sourceCode: 'https://github.com/Mr-Zero272/movie-ticket-remake',
        slides: [
            { asset: '/images/projects/movie/movie-v-1.png', width: 3840, height: 5760 },
            { asset: '/images/projects/movie/movie-v-2.png', width: 3840, height: 5760 },
            { asset: '/images/projects/movie/movie-v-3.png', width: 3840, height: 5760 },
            { asset: '/images/projects/movie/movie-v-4.png', width: 3840, height: 5760 },
            { asset: '/images/projects/movie/movie-h-1.png', width: 3840, height: 2880 },
            { asset: '/images/projects/movie/movie-h-2.png', width: 3840, height: 2880 },
            { asset: '/images/projects/movie/movie-h-3.png', width: 3840, height: 2880 },
            { asset: '/images/projects/movie/movie-h-4.png', width: 3840, height: 2880 },
        ].map(({ asset, width, height }) => ({
            src: asset,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => ({
                src: asset,
                width: breakpoint,
                height: Math.round((height / width) * breakpoint),
            })),
        })),
    },
    {
        id: '002',
        name: 'Chat app realtime',
        images: {
            vertical: [
                '/images/projects/chat-app/chat-v-1.png',
                '/images/projects/chat-app/chat-v-2.png',
                '/images/projects/chat-app/chat-v-3.png',
            ],
            horizontal: [
                '/images/projects/chat-app/chat-h-1.png',
                '/images/projects/chat-app/chat-h-2.png',
                '/images/projects/chat-app/chat-h-3.png',
            ],
        },
        type: 'website',
        status: 'deployed',
        description:
            'This project focuses on building a real-time messaging app to understand how real-time applications function while practicing ReactJS and Express. The key feature is the integration of Socket.IO, enabling real-time message sending and receiving to meet user communication needs.',
        responsibilities: 'design and implement the entire project yourself',
        technologies: ['ReactJS', 'Tailwindcss', 'Express', 'Socket.IO', 'Cloudinary'],
        database: ['MongoDB'],
        sourceCode: 'Source code: https://github.com/Mr-Zero272/chat-app',
        slides: [
            { asset: '/images/projects/chat-app/chat-v-1.png', width: 3840, height: 5760 },
            { asset: '/images/projects/chat-app/chat-v-2.png', width: 3840, height: 5760 },
            { asset: '/images/projects/chat-app/chat-v-3.png', width: 3840, height: 5760 },
            { asset: '/images/projects/chat-app/chat-h-1.png', width: 3840, height: 2880 },
            { asset: '/images/projects/chat-app/chat-h-2.png', width: 3840, height: 2880 },
            { asset: '/images/projects/chat-app/chat-h-3.png', width: 3840, height: 2880 },
        ].map(({ asset, width, height }) => ({
            src: asset,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => ({
                src: asset,
                width: breakpoint,
                height: Math.round((height / width) * breakpoint),
            })),
        })),
    },
    {
        id: '003',
        name: 'My portfolio',
        images: {
            vertical: [
                '/images/projects/portfolio/my-portfolio-v-1.png',
                '/images/projects/portfolio/my-portfolio-v-2.png',
                '/images/projects/portfolio/my-portfolio-v-3.png',
            ],
            horizontal: [
                '/images/projects/portfolio/my-portfolio-h-1.png',
                '/images/projects/portfolio/my-portfolio-h-2.png',
                '/images/projects/portfolio/my-portfolio-h-3.png',
            ],
        },
        type: 'website',
        status: 'deployed',
        description:
            'My portfolio is my personal project, the project basically provides full information about my profile including basic information, the skills I have, the technologies I use,...',
        responsibilities: 'design and implement the entire project yourself',
        technologies: ['Next.js', 'Typescript'],
        database: ['None'],
        sourceCode: 'https://github.com/Mr-Zero272/my-portfolio',
        slides: [
            { asset: '/images/projects/portfolio/my-portfolio-v-1.png', width: 3840, height: 5760 },
            { asset: '/images/projects/portfolio/my-portfolio-v-2.png', width: 3840, height: 5760 },
            { asset: '/images/projects/portfolio/my-portfolio-v-3.png', width: 3840, height: 5760 },
            { asset: '/images/projects/portfolio/my-portfolio-h-1.png', width: 3840, height: 2880 },
            { asset: '/images/projects/portfolio/my-portfolio-h-2.png', width: 3840, height: 2880 },
            { asset: '/images/projects/portfolio/my-portfolio-h-3.png', width: 3840, height: 2880 },
            { asset: '/images/projects/portfolio/my-portfolio-h-4.png', width: 3840, height: 2880 },
        ].map(({ asset, width, height }) => ({
            src: asset,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => ({
                src: asset,
                width: breakpoint,
                height: Math.round((height / width) * breakpoint),
            })),
        })),
    },
    {
        id: '004',
        name: 'Thread app clone',
        images: {
            vertical: [
                '/images/projects/threadclone/thread-v-1.png',
                '/images/projects/threadclone/thread-v-2.png',
                '/images/projects/threadclone/thread-v-3.png',
            ],
            horizontal: [
                '/images/projects/threadclone/thread-h-1.png',
                '/images/projects/threadclone/thread-h-2.png',
                '/images/projects/threadclone/thread-h-3.png',
            ],
        },
        type: 'website',
        status: 'developing',
        description:
            'Threads is a social media application developed by Instagram. This is a small project that clones this application with basic functions. I created it while studying a course with NextJs',
        responsibilities: 'carry out the entire project based on instructions',
        technologies: ['Next.js', 'Typescript', 'Clerk'],
        database: ['Mongodb'],
        sourceCode: 'https://github.com/Mr-Zero272/thread_app_clone',
        slides: [
            { asset: '/images/projects/threadclone/thread-v-1.png', width: 3840, height: 5760 },
            { asset: '/images/projects/threadclone/thread-v-2.png', width: 3840, height: 5760 },
            { asset: '/images/projects/threadclone/thread-v-3.png', width: 3840, height: 5760 },
            { asset: '/images/projects/threadclone/thread-h-1.png', width: 3840, height: 2880 },
            { asset: '/images/projects/threadclone/thread-h-2.png', width: 3840, height: 2880 },
            { asset: '/images/projects/threadclone/thread-h-3.png', width: 3840, height: 2880 },
        ].map(({ asset, width, height }) => ({
            src: asset,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => ({
                src: asset,
                width: breakpoint,
                height: Math.round((height / width) * breakpoint),
            })),
        })),
    },
];
