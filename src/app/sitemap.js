export default function sitemap() {
    const baseUrl = 'https://gospelchurch.kr';
    const routes = ['', '/about', '/visit', '/messages'];

    return routes.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
    }));
}
