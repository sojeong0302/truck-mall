// src/app/layout.tsx
import "./globals.css";
import Header from "../components/Header"; // 경로는 실제 위치에 맞게 조정해줘

export const metadata = {
    title: "새마을 트럭",
    description: "특장차 매매 사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <Header />
                {children}
            </body>
        </html>
    );
}
