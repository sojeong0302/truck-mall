"use client";
import { useRouter } from "next/navigation";

export default function Footer() {
    return (
        <div className="border-t border-[#cecece] w-full p-4 flex justify-center">
            <div className="text-xs flex flex-col text-center gap-1">
                <div>ⓒ 2025 새마을 트럭 All rights reserved</div>
                <div>주소: 경기 안산시 단원구 풍전호 53, 안산오토돔 465, 466호</div>
                <div>대표전화: 010-8191-8244</div>
                <div>팩스번호: 031-8191-8244</div>
            </div>
        </div>
    );
}
