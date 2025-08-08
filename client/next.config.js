// client/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ["localhost"], // Flask 도메인도 추가 가능
    },
};

module.exports = nextConfig;
