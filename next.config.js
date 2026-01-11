/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 's3.us-west-2.amazonaws.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/archives/:path*',
                destination: '/',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
