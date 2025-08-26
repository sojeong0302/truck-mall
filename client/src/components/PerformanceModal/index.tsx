"use client";

import { useRef } from "react";
import ShortButton from "../ShortButton";

export default function PerformanceModal() {
    // 숨겨진 파일 input에 접근하기 위한 ref
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("선택된 파일:", file);
            // 여기서 상태에 저장하거나 FormData에 append 하면 됨
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center gap-3">
                {/* 실제 파일 입력은 숨김 */}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {/* 버튼 클릭 시 input 클릭 트리거 */}
                <ShortButton onClick={handleOpenFileDialog}>파일 선택</ShortButton>
            </div>
        </div>
    );
}
