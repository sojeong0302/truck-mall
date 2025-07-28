import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
                <Footer />
            </body>
        </html>
    );
}
