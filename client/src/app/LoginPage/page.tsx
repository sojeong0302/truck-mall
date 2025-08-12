// "use client";

// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { LoginPagePropStore } from "./LoginPage.types";
// import { useAuthStore } from "@/store/useAuthStore";

// export default function LoginPage() {
//     const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
//     const router = useRouter();
//     const { username, setUsername, password, setPassword } = LoginPagePropStore();
//     const { setToken } = useAuthStore();

//     // 로그인 시도
//     const handleLogin = async (e?: React.FormEvent) => {
//         if (e) e.preventDefault();
//         try {
//             const { data } = await axios.post(
//                 `${BASE_URL}/auth/login`,
//                 { username, password },
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             const token = data.access_token;
//             setToken(token);
//             axios.defaults.headers.common.Authorization = `Bearer ${token}`;
//             router.push("/");
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     return (
//         <div className="w-full p-5 sm:p-25 flex justify-center">
//             <form
//                 onSubmit={handleLogin}
//                 className="sm:min-w-[500px] shadow-lg w-[100%] sm:w-[40%] flex flex-col border-4 border-[#2E7D32] sm:p-5 p-1 items-center gap-5 sm:gap-15 rounded-4xl"
//             >
//                 <div className="text-2xl sm:text-4xl mt-10 sm:mt-20 font-bold">로그인</div>
//                 <div className="w-[80%] flex flex-col gap-5 sm:gap-10">
//                     <input
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="아이디"
//                         className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-3 sm:p-5"
//                     />
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="비밀번호"
//                         className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-3 sm:p-5"
//                     />
//                     <button
//                         type="submit"
//                         className="mb-10 sm:mb-20 bg-[#2E7D32] text-white w-[100%] flex justify-center shadow-lg text-xl sm:text-2xl cursor-pointer p-3 sm:p-5 rounded-xl font-medium transition transform duration-200 hover:scale-103 active:scale-97"
//                     >
//                         로그인
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }
// src/app/LoginPage/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { LoginPagePropStore } from "./LoginPage.types";
import { useAuthStore } from "@/store/useAuthStore";

// (선택) 로그인 페이지는 미리 렌더링하지 않도록
export const dynamic = "force-dynamic"; // 또는 export const revalidate = 0;

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="p-6">로딩중…</div>}>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const search = useSearchParams();

    // ✅ 쿼리 읽기: useSearchParams는 여기(서스펜스 내부)에서만!
    const expired = search.get("expired") === "1";
    const nextUrl = search.get("next") || "/";

    const { username, setUsername, password, setPassword } = LoginPagePropStore();
    const setToken = useAuthStore((s) => s.setToken);

    // 만료로 들어온 경우 남아있을 수 있는 예전 토큰 정리(옵션)
    useEffect(() => {
        if (expired) {
            try {
                localStorage.removeItem("access_token");
                localStorage.removeItem("token");
            } catch {}
        }
    }, [expired]);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            const { data } = await axios.post(
                `${BASE_URL}/auth/login`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const token = data.access_token;
            setToken(token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            const returnTo = sessionStorage.getItem("returnTo") || nextUrl || "/";
            sessionStorage.removeItem("returnTo");
            router.replace(returnTo);
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

                {expired && (
                    <div className="w-[80%] bg-yellow-100 text-yellow-800 rounded-md p-3 text-sm sm:text-base">
                        세션이 만료되었습니다. 다시 로그인해 주세요.
                    </div>
                )}

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
