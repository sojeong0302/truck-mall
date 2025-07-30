"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    return (
        <div className="w-full p-25 flex justify-center">
            <div className="min-w-[500px] shadow-lg w-[40%] flex flex-col border-4 border-[#2E7D32] p-5 items-center gap-15 rounded-4xl ">
                <div className="text-4xl mt-20 font-bold">로그인</div>
                <div className="w-[80%] flex flex-col gap-10">
                    <input
                        placeholder="아이디"
                        className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-5"
                    />
                    <input
                        placeholder="비밀번호"
                        className="w-[100%] border-1 border-[#2E7D32] shadow-md rounded-xl p-5"
                    />
                    <div
                        onClick={() => router.push("/")}
                        className="mb-20 bg-[#2E7D32] text-white w-[100%] flex justify-center shadow-lg text-2xl cursor-pointer p-5 rounded-xl font-medium transition transform duration-200 hover:scale-103 active:scale-97"
                    >
                        로그인
                    </div>
                </div>
            </div>
        </div>
    );
}
