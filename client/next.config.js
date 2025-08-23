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
                            "frame-src 'self' blob: data: https: http:",
                            "child-src 'self' blob: data: https: http:",
                            "object-src 'self' blob: data:",
                            // ⬇️ 이 줄이 중요 (pdf.js 워커용)
                            "worker-src 'self' blob: https:",
                        ].join("; "),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
