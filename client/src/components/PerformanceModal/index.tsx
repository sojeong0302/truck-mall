"use client";

import { useRef, useState, useEffect } from "react";
import ShortButton from "../ShortButton";
import { usePerformanceModal } from "./PerformanceModal.hooks";

export default function PerformanceModal() {
    const { isOpen, close } = usePerformanceModal();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ✅ PDF 미리보기용 상태
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleOpenFileDialog = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // PDF만 허용
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            alert("PDF 파일만 선택해주세요.");
            // 잘못 선택했으면 input 초기화
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const url = URL.createObjectURL(file);
        setPdfUrl(url);
    };

    // ✅ URL 메모리 해제
    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

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

                {/* 숨김 input */}
                <input
                    type="file"
                    accept="application/pdf" // ✅ PDF만 선택 가능
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

                {/* ✅ PDF 미리보기 */}
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-[70vh] border rounded-xl"
                        // 일부 브라우저에서 다운로드 대신 보기만 원하면 아래 속성 활용 가능
                        // sandbox="allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    />
                ) : (
                    <div className="w-full h-[40vh] grid place-items-center border rounded-xl text-gray-500">
                        PDF를 선택하면 여기에서 미리보기됩니다.
                    </div>
                )}
            </div>
        </div>
    );
}
