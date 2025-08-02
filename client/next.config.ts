import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["localhost"], // 여기에 Flask 서버 도메인 추가
    },
};

export default nextConfig;
