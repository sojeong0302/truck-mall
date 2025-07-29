"use client";

import { BulletinComponentProps } from "./Bulletin.types";
import { useRouter } from "next/navigation";

export default function Bulletin({ posts, basePath }: BulletinComponentProps) {
    const router = useRouter();

    const handleClick = (id: number) => {
        router.push(`/${basePath}/${id}`);
    };

    return (
        <div className="w-[100%] h-[100%] flex items-center w-full flex-col p-20">
            <div className="w-[80%] h-[100%] flex flex-col justify-center items-center">
                <div className="text-3xl w-full flex border-b-2 border-[#575757] justify-around py-2 font-bold">
                    <div className="w-[30%] text-center">제목</div>
                    <div className="w-[30%] text-center">내용</div>
                    <div className="w-[20%] text-center">작성일</div>
                    <div className="w-[15%] text-center">조회수</div>
                </div>

                {posts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => handleClick(post.id)}
                        className="cursor-pointer text-2xl w-full flex border-b-2 border-[#575757] justify-between py-2 hover:bg-gray-50 transition"
                    >
                        <div className="p-2 font-bold w-[30%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.title}
                        </div>
                        <div className="p-2 w-[30%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.content}
                        </div>
                        <div className="p-2 w-[20%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.date}
                        </div>
                        <div className="p-2 w-[15%] text-center truncate overflow-hidden whitespace-nowrap">
                            {post.views}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
