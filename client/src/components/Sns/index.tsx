"use client";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

export default function Sns() {
    // 공통 스타일
    const btn =
        "flex items-center justify-center rounded-2xl shadow-lg transition transform duration-200 hover:scale-110 active:scale-95";
    // 아이콘 버튼 크기(모바일/데스크탑)
    const size = "w-12 h-12 sm:w-16 sm:h-16";

    return (
        <div className="shadow-lg bg-[rgba(46,125,50,0.75)] flex sm:flex-col gap-5 sm:p-6 p-4 sm:items-start items-center rounded-4xl">
            {/* 네이버 블로그 */}
            <a
                href="https://m.blog.naver.com/PostList.naver?blogId=newtown_truck-&tab=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="네이버 블로그"
                className={`${btn} ${size} bg-[#5F9A62]`}
            >
                <img src="/images/naver.png" alt="네이버 블로그" className="w-3/4 h-3/4 object-contain" />
            </a>

            {/* 카카오 오픈채팅 */}
            <a
                href="https://open.kakao.com/o/sy2XQ9Eh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오 오픈채팅"
                className={`${btn} ${size} bg-yellow-400 text-black`}
            >
                <ChatBubbleLeftEllipsisIcon className="w-3/4 h-3/4" />
            </a>
        </div>
    );
}
