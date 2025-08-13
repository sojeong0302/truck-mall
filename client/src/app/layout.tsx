import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppInitializer from "@/components/AppInitializer";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const hydrate = useAuthStore((s) => s.hydrate);
    useEffect(() => {
        hydrate();
    }, [hydrate]);
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
