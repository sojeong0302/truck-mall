"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginPagePropStore } from "./LoginPage.types";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { username, setUsername, password, setPassword } = LoginPagePropStore();
    const { login } = useAuthStore();

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        try {
            const response = await axios.post(
                `${BASE_URL}/auth/login`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const token = response.data.access_token;
            localStorage.setItem("token", token);
            login();
            router.push("/");
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full p-25 flex justify-center">
            <form
                onSubmit={handleLogin}
                className="min-w-[500px] shadow-lg w-[40%] flex flex-col border-4 border-[#2E7D32] p-5 items-center gap-15 rounded-4xl"
            >
                <div className="text-4xl mt-20 font-bold">로그인</div>
                <div className="w-[80%] flex flex-col gap-10">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                        className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-5"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-5"
                    />
                    <button
                        type="submit"
                        className="mb-20 bg-[#2E7D32] text-white w-[100%] flex justify-center shadow-lg text-2xl cursor-pointer p-5 rounded-xl font-medium transition transform duration-200 hover:scale-103 active:scale-97"
                    >
                        로그인
                    </button>
                </div>
            </form>
        </div>
    );
}
