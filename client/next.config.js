// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     eslint: {
//         ignoreDuringBuilds: true, // ✅ 빌드 단계에서 ESLint 무시
//     },
//     images: {
//         // 절대경로 이미지 표시 위해 백엔드 호스트 허용
//         domains: ["www.saemaeultruck.pics"],
//         // 또는 remotePatterns 사용 가능
//         // remotePatterns: [{ protocol: "https", hostname: "www.saemaeultruck.pics" }],
//     },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: { ignoreDuringBuilds: true },
    images: {
        domains: ["www.saemaeultruck.pics"],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            "img-src 'self' blob: data: https: http:",
                            "media-src 'self' blob: data: https: http:",
                            "font-src 'self' data: https: http:", // ✅ 폰트 data: 허용
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
                            "style-src 'self' 'unsafe-inline' https:",
                            "connect-src *",
                            "frame-src *",
                        ].join("; "),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
