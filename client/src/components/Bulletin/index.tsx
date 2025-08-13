"use client";

import { BulletinComponentProps } from "./Bulletin.types";
import { useRouter } from "next/navigation";
import { useAuthToggle } from "../Header/Header.hooks";

export default function Bulletin({ posts, basePath, uploadPath }: BulletinComponentProps) {
    const router = useRouter();
    const { isLoggedIn, toggleAuth, isHydrated } = useAuthToggle();

    const handleClick = (id: number) => {
        router.push(`/${basePath}/${id}`);
    };

    const handleGoUpload = () => {
        router.push(`/${uploadPath}/`);
    };

    return (
        <div className="w-[100%] h-[100%] flex items-center w-full flex-col p-0 sm:p-20 sm: mb-0 mb-10">
            {isLoggedIn && (
                <div className="flex sm:w-[80%] w-[90%] justify-end pt-3 gap-2 sm:p-4 text-xs sm:text-sm">
                    <div onClick={handleGoUpload} className="cursor-pointer">
                        등록하기
                    </div>
                </div>
            )}
            <div className="sm:w-[80%] w-[90%] h-[100%] flex flex-col justify-center items-center">
                <div className="text-base sm:text-3xl w-full flex border-b-2 border-[#575757] justify-around py-2 font-bold">
                    <div className="w-[35%] text-center">제목</div>
                    <div className="w-[25%] text-center">내용</div>
                    <div className="w-[20%] text-center">작성일</div>
                    <div className="w-[15%] text-center">조회수</div>
                </div>

                {posts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => handleClick(post.id)}
                        className="cursor-pointer text-sm sm:text-2xl w-full flex border-b-2 border-[#575757] justify-between py-2 hover:bg-gray-50 transition"
                    >
                        <div className="p-2 font-bold w-[35%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.title}
                        </div>
                        <div className="p-2 w-[25%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.content}
                        </div>
                        <div className="p-2 w-[20%] text-center truncate overflow-hidden whitespace-nowrap">
                            <span className="hidden sm:inline">{post.date?.split("T")[0].split("-").join("-")}</span>
                            <span className="inline sm:hidden">{post.date?.slice(5)}</span>
                        </div>

                        <div className="p-2 w-[15%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.view}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
