"use client";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

export default function Sns() {
    return (
        <div className="shadow-lg bg-[rgba(46,125,50,0.75)] flex sm:flex-col gap-5 sm:p-6 p-4 w-auto m:items-start items-center rounded-4xl">
            {/* 네이버 블로그 아이콘 */}
            <a
                href="https://m.blog.naver.com/PostList.naver?blogId=newtown_truck-&tab=1"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="/images/naver.png"
                    alt="네이버 블로그"
                    className="transition transform duration-200 hover:scale-110 active:scale-95 shadow-lg w-auto h-15 sm:h-20 max-w-[200px] rounded-[16px]"
                />
            </a>

            {/* 카카오 오픈채팅 아이콘 */}
            <a href="https://open.kakao.com/o/sy2XQ9Eh" target="_blank" rel="noopener noreferrer">
                <ChatBubbleLeftEllipsisIcon className="transition transform duration-200 hover:scale-110 active:scale-95 shadow-lg w-auto h-16 sm:h-20 bg-yellow-400 p-3 rounded-[16px]" />
            </a>

            {/* 디자인용 투명 아이콘 (실제 클릭 불가) */}
            <div className="pointer-events-none opacity-0">
                <ChatBubbleLeftEllipsisIcon className="w-auto h-20 p-3 rounded-[16px]" />
            </div>
        </div>
    );
}
