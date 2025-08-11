/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // ✅ 빌드 단계에서 ESLint 무시
    },
    images: {
        // 절대경로 이미지 표시 위해 백엔드 호스트 허용
        domains: ["www.saemaeultruck.pics"],
        // 또는 remotePatterns 사용 가능
        // remotePatterns: [{ protocol: "https", hostname: "www.saemaeultruck.pics" }],
    },
};

module.exports = nextConfig;
