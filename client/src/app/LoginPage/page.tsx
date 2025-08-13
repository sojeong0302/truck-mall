"use client";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { LoginPagePropStore } from "./LoginPage.types";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const search = useSearchParams();

    const nextUrl = search?.get("next") || "/";

    const { username, setUsername, password, setPassword } = LoginPagePropStore();
    const setToken = useAuthStore((s) => s.setToken);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            const { data } = await axios.post(
                `${BASE_URL}/auth/login`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const token = data.access_token as string;

            // 1) localStorage 저장
            localStorage.setItem("token", token);
            // 2) 전역 스토어 갱신 (layout에서 hydrate 되어 있어도 즉시 반영)
            setToken(token);
            // 3) axios 기본 헤더 설정
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // 4) next 파라미터로 이동
            router.replace(nextUrl);
        } catch (err) {
            console.error(err);
            alert("로그인 실패");
        }
    };

    return (
        <div className="w-full p-5 sm:p-25 flex justify-center">
            <form
                onSubmit={handleLogin}
                className="sm:min-w-[500px] shadow-lg w-[100%] sm:w-[40%] flex flex-col border-4 border-[#2E7D32] sm:p-5 p-1 items-center gap-5 sm:gap-15 rounded-4xl"
            >
                <div className="text-2xl sm:text-4xl mt-10 sm:mt-20 font-bold">로그인</div>

                <div className="w-[80%] flex flex-col gap-5 sm:gap-10">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                        className="w-full border-1 border-[#2E7D32] shadow-md rounded-xl p-3 sm:p-5"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        className="w-full border-1 border-[#2E7D32] shadow-md rounded-xl p-3 sm:p-5"
                    />
                    <button
                        type="submit"
                        className="mb-10 sm:mb-20 bg-[#2E7D32] text-white w-full flex justify-center shadow-lg text-xl sm:text-2xl cursor-pointer p-3 sm:p-5 rounded-xl font-medium transition transform duration-200 hover:scale-103 active:scale-97"
                    >
                        로그인
                    </button>
                </div>
            </form>
        </div>
    );
}
