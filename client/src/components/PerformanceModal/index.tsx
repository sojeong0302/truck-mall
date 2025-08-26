"use client";

import { useRef } from "react";
import ShortButton from "../ShortButton";
import { usePerformanceModal } from "./PerformanceModal.hooks";

export default function PerformanceModal() {
    const { isOpen, close } = usePerformanceModal(); // ✅ 열림 상태 사용
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!isOpen) return null; // ✅ 닫혀 있으면 렌더하지 않음

    const handleOpenFileDialog = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("선택된 파일:", file);
        }
    };

    return (
        // ✅ 화면 전체 오버레이 + 클릭 시 닫기
        <div className="fixed inset-0 z-[1000] grid place-items-center">
            <div className="absolute inset-0 bg-black/40" onClick={close} />
            <div className="relative z-10 w-[90vw] max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold">성능점검표</div>
                    <button onClick={close} className="text-sm text-gray-500">
                        닫기
                    </button>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <ShortButton onClick={handleOpenFileDialog}>파일 선택</ShortButton>
            </div>
        </div>
    );
}
