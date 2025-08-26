"use client";

import { useRef, useState, useEffect } from "react";
import ShortButton from "../ShortButton";
import { usePerformanceModal } from "./PerformanceModal.hooks";

export default function PerformanceModal() {
    const { isOpen, close } = usePerformanceModal();

    // ✅ 훅은 최상단에서 항상 호출
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    // ✅ URL 정리도 최상단 훅으로
    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    if (!isOpen) return null; // ✅ 훅들 아래에 위치

    const handleOpenFileDialog = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("PDF만 선택 가능합니다");
            return;
        }

        // ✅ 브라우저 메모리 blob URL 생성
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
    };

    const clearPdf = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
    };

    return (
        <div className="fixed inset-0 z-[1000] grid place-items-center">
            <div className="absolute inset-0 bg-black/40" onClick={close} />
            <div className="relative z-10 w-[92vw] max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-semibold">성능점검표</div>
                    <button onClick={close} className="cursor-pointer text-sm text-gray-500">
                        x
                    </button>
                </div>

                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex gap-2 mb-4">
                    <ShortButton className="bg-[#2E7D32] text-white" onClick={handleOpenFileDialog}>
                        PDF 선택
                    </ShortButton>
                    {pdfUrl && (
                        <ShortButton className="bg-white border-2 border-[#2E7D32] text-[#2E7D32]" onClick={clearPdf}>
                            미리보기 지우기
                        </ShortButton>
                    )}
                </div>

                {pdfUrl ? (
                    <iframe src={pdfUrl} className="w-full h-[70vh] border rounded-xl" />
                ) : (
                    <div className="w-full h-[40vh] grid place-items-center border rounded-xl text-gray-500">
                        PDF를 선택하면 여기에서 미리보기됩니다.
                    </div>
                )}
            </div>
        </div>
    );
}
