/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://pitithuong.vercel.app/',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    priority: 0.7,
    changefreq: 'weekly',
    transform: async (config, path) => {
        // Custom priority và changefreq cho từng page
        const customPriorities = {
            '/': 1.0, // Homepage - priority cao nhất
            '/about-me': 0.8, // About - priority cao
            '/projects': 0.9, // Projects - priority rất cao
            '/contact': 0.8, // Contact - priority cao
            '/favorite': 0.6, // Favorite - priority thấp hơn
        };

        const customChangefreq = {
            '/': 'weekly',
            '/about-me': 'monthly',
            '/projects': 'weekly',
            '/contact': 'monthly',
            '/favorite': 'monthly',
        };

        return {
            loc: path,
            changefreq: customChangefreq[path] || config.changefreq,
            priority: customPriorities[path] || config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
    },
};
