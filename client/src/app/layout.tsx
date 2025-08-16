import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppInitializer from "@/components/AppInitializer";

export const metadata = {
    metadataBase: new URL("https://truck-mall-truck-mall.vercel.app"),
    title: {
        default: "새마일 트럭",
        template: "%s | 새마일 트럭",
    },
    description: "새마일 트럭 — 중고 화물차/버스 매물 플랫폼",
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png",
    },
    openGraph: {
        title: "새마일 트럭",
        description: "중고 화물차/버스 매물 플랫폼",
        url: "/", // ← metadataBase 기준으로 절대주소가 됩니다
        siteName: "새마일 트럭",
        images: [{ url: "/og.png", width: 1200, height: 630 }],
        locale: "ko_KR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "새마일 트럭",
        description: "중고 화물차/버스 매물 플랫폼",
        images: ["/og.png"],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="bg-[#F5F5F5]">
                {/* ✅ 반드시 body 안에서 마운트 */}
                <AppInitializer />
                <Header />
                <div className="w-[100%] mx-auto">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
