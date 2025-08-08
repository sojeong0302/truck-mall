// client/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ["localhost"], // 여기에 Flask 서버 도메인 추가
    },
};

export default nextConfig;
