export const projects = [
  {
    id: '001',
    name: 'Movie online ticket booking',
    images: [
      '/images/projects/movie/movie-v-1.png',
      '/images/projects/movie/movie-v-2.png',
      '/images/projects/movie/movie-v-3.png',
      '/images/projects/movie/movie-v-4.png',
      '/images/projects/movie/movie-h-1.png',
      '/images/projects/movie/movie-h-2.png',
      '/images/projects/movie/movie-h-3.png',
      '/images/projects/movie/movie-h-4.png',
    ],

    type: 'website',
    status: 'developing',
    description:
      'The project simulates real-life movie ticket sales, using Spring boot with microservices architecture, Nextjs, Angular, Mongodb and MySql to provide a user-friendly, easy-to-use and high-performance website. Combined with techniques using Kafka and websocket to simulate the seat selection process in real time. Apply Jwt for application security',
    responsibilities: 'design and implement the entire project yourself',
    technologies: ['Next.js', 'Angular', 'Spring Boot', 'Spring Security', 'Kafka', 'Redis'],
    database: ['MongoDB', 'MySql'],
    sourceCode: 'https://github.com/Mr-Zero272/movie-ticket-remake',
  },
  {
    id: '002',
    name: 'Chat app realtime',
    images: [
      '/images/projects/chat-app/chat-v-1.png',
      '/images/projects/chat-app/chat-v-2.png',
      '/images/projects/chat-app/chat-v-3.png',
      '/images/projects/chat-app/chat-h-1.png',
      '/images/projects/chat-app/chat-h-2.png',
      '/images/projects/chat-app/chat-h-3.png',
    ],

    type: 'website',
    status: 'deployed',
    description:
      'This project focuses on building a real-time messaging app to understand how real-time applications function while practicing ReactJS and Express. The key feature is the integration of Socket.IO, enabling real-time message sending and receiving to meet user communication needs.',
    responsibilities: 'design and implement the entire project yourself',
    technologies: ['ReactJS', 'Tailwindcss', 'Express', 'Socket.IO', 'Cloudinary'],
    database: ['MongoDB'],
    sourceCode: 'https://github.com/Mr-Zero272/chat-app',
  },
  {
    id: '003',
    name: 'My portfolio',
    images: [
      '/images/projects/portfolio/my-portfolio-v-1.png',
      '/images/projects/portfolio/my-portfolio-v-2.png',
      '/images/projects/portfolio/my-portfolio-v-3.png',
      '/images/projects/portfolio/my-portfolio-h-1.png',
      '/images/projects/portfolio/my-portfolio-h-2.png',
      '/images/projects/portfolio/my-portfolio-h-3.png',
    ],

    type: 'website',
    status: 'deployed',
    description:
      'My portfolio is my personal project, the project basically provides full information about my profile including basic information, the skills I have, the technologies I use,...',
    responsibilities: 'design and implement the entire project yourself',
    technologies: ['Next.js', 'Typescript'],
    database: ['None'],
    sourceCode: 'https://github.com/Mr-Zero272/my-portfolio',
  },
  {
    id: '004',
    name: 'Thread app clone',
    images: [
      '/images/projects/threadclone/thread-v-1.png',
      '/images/projects/threadclone/thread-v-2.png',
      '/images/projects/threadclone/thread-v-3.png',
      '/images/projects/threadclone/thread-h-1.png',
      '/images/projects/threadclone/thread-h-2.png',
      '/images/projects/threadclone/thread-h-3.png',
    ],

    type: 'website',
    status: 'developing',
    description:
      'Threads is a social media application developed by Instagram. This is a small project that clones this application with basic functions. I created it while studying a course with NextJs',
    responsibilities: 'carry out the entire project based on instructions',
    technologies: ['Next.js', 'Typescript', 'Clerk'],
    database: ['Mongodb'],
    sourceCode: 'https://github.com/Mr-Zero272/thread_app_clone',
  },
];
