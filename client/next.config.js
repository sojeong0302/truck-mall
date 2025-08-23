/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: { ignoreDuringBuilds: true },
    images: { domains: ["www.saemaeultruck.pics"] },
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
                            "font-src 'self' data: https: http:",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
                            "style-src 'self' 'unsafe-inline' https:",
                            "connect-src *",
                            // ⬇️ 핵심: blob: (필요시 data:) 명시
                            "frame-src 'self' blob: data: https: http:",
                            // 일부 브라우저/구버전 호환
                            "child-src 'self' blob: data: https: http:",
                            // <object>/<embed>로 열 때 대비
                            "object-src 'self' blob: data:",
                            // pdf.js/워커 대비
                            "worker-src 'self' blob:",
                        ].join("; "),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
