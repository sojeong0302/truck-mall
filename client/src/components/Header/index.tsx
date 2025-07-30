"use client";

import { useAuthToggle } from "./Header.hooks";
import { useRouter } from "next/navigation";

export default function Header() {
    const { isLoggedIn, toggleAuth } = useAuthToggle();
    const router = useRouter();

    return (
        <>
            {/* 로그인 상태 바 */}
            <div className="flex w-full justify-end gap-2 p-4 text-sm">
                <div className="cursor-pointer" onClick={() => router.push("/")}>
                    홈
                </div>
                |
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            router.push("/LoginPage");
                        } else {
                            toggleAuth();
                        }
                    }}
                >
                    {isLoggedIn ? "로그아웃" : "로그인"}
                </div>
            </div>

            {/* 헤더 전체 */}
            <div className="flex w-full h-full p-4">
                <div
                    className="flex items-center justify-center w-full gap-4 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    {/* 로고 이미지 */}
                    <img
                        src="/images/logo.png"
                        alt="로고"
                        className="w-[120px] h-auto rounded-full border border-black shadow-md"
                    />

                    {/* 로고 텍스트 */}
                    <div className="flex flex-col gap-2">
                        <div className="text-5xl font-bold">화물차 / 특장차 매매 전문 새마을 트럭</div>
                        <div className="text-2xl font-semibold">
                            10년간에 도길 프리미엄 브랜드 재직경험을 바탕으로 진정성 넘치는 판매를 추구 합니다.
                        </div>
                    </div>
                </div>
            </div>

            {/* 메뉴바 */}
            <div className="flex bg-[#2E7D32] text-white p-4 justify-center w-full gap-28 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <div
                    onClick={() => router.push("/CarSearchPage")}
                    className="text-3xl font-bold cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95"
                >
                    차량검색
                </div>

                <div
                    onClick={() => router.push("/AdvicePage")}
                    className="text-3xl font-bold cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95"
                >
                    상담하기
                </div>
                <div
                    onClick={() => router.push("/CarTIPPage")}
                    className="text-3xl font-bold cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95"
                >
                    차량관리TIP
                </div>
                <div
                    onClick={() => router.push("/ReviewPage")}
                    className="text-3xl font-bold cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95"
                >
                    후기
                </div>
                <div
                    onClick={() => router.push("/IntroPage")}
                    className="text-3xl font-bold cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95"
                >
                    회사소개
                </div>
            </div>
        </>
    );
}
