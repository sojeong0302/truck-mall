"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { LoginPagePropStore } from "./LoginPage.types";

export default function LoginPage() {
    const router = useRouter();
    const { username, setUsername, password, setPassword } = LoginPagePropStore();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/auth/login", {
                username,
                password,
            });

            const token = response.data.access_token;
            localStorage.setItem("token", token);
            router.push("/");
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full p-25 flex justify-center">
            <div className="min-w-[500px] shadow-lg w-[40%] flex flex-col border-4 border-[#2E7D32] p-5 items-center gap-15 rounded-4xl ">
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
                    <div
                        onClick={handleLogin}
                        className="mb-20 bg-[#2E7D32] text-white w-[100%] flex justify-center shadow-lg text-2xl cursor-pointer p-5 rounded-xl font-medium transition transform duration-200 hover:scale-103 active:scale-97"
                    >
                        로그인
                    </div>
                </div>
            </div>
        </div>
    );
}
