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
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { LoginPagePropStore } from "./LoginPage.types";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function LoginPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const search = useSearchParams();

    // ✅ 쿼리로 만료 여부/복귀 경로 받기
    const expired = search.get("expired") === "1";
    const nextUrl = search.get("next") || "/";

    const { username, setUsername, password, setPassword } = LoginPagePropStore();
    const setToken = useAuthStore((s) => s.setToken);

    // (선택) 만료로 온 경우, 혹시 남아있을 구식 토큰들 정리
    useEffect(() => {
        if (expired) {
            try {
                localStorage.removeItem("access_token");
                localStorage.removeItem("token");
            } catch {}
        }
    }, [expired]);

    // 로그인 시도
    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            const { data } = await axios.post(
                `${BASE_URL}/auth/login`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const token = data.access_token;

            // ✅ 상태 저장(영속) + axios 헤더 반영
            setToken(token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            // ✅ 원래 보던 곳으로 복귀 (sessionStorage > next 쿼리 > '/')
            const returnTo = sessionStorage.getItem("returnTo") || nextUrl || "/";
            sessionStorage.removeItem("returnTo");

            router.replace(returnTo); // replace로 히스토리 깔끔하게
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

                {/* ✅ 만료 안내 배너 */}
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
                        className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-3 sm:p-5"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-3 sm:p-5"
                    />
                    <button
                        type="submit"
                        className="mb-10 sm:mb-20 bg-[#2E7D32] text-white w-[100%] flex justify-center shadow-lg text-xl sm:text-2xl cursor-pointer p-3 sm:p-5 rounded-xl font-medium transition transform duration-200 hover:scale-103 active:scale-97"
                    >
                        로그인
                    </button>
                </div>
            </form>
        </div>
    );
}
