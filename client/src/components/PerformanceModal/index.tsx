"use client";

import { useRef, useState, useEffect } from "react";
import ShortButton from "../ShortButton";
import { usePerformanceModal } from "./PerformanceModal.hooks";

export default function PerformanceModal() {
    const { isOpen, close } = usePerformanceModal();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 미리보기 URL (blob 전용)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    // 훅은 항상 최상단에서 호출
    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    if (!isOpen) return null;

    const handleOpenFileDialog = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 확장자 체크 (이름 기준)
        const isPdfName = /\.pdf$/i.test(file.name);

        // 일부 환경은 file.type === "application/haansoftpdf" 또는 빈 문자열로 옴
        const looksLikePdf = isPdfName || file.type === "application/pdf" || file.type.includes("pdf");

        if (!looksLikePdf) {
            alert("PDF만 선택 가능합니다.");
            e.currentTarget.value = "";
            return;
        }

        // 👉 핵심: 'application/pdf'로 강제 래핑해서 blob URL 생성
        let blob: Blob;

        try {
            // 파일을 바이트로 읽은 뒤, 올바른 MIME으로 새 Blob 생성
            const buf = await file.arrayBuffer();
            blob = new Blob([buf], { type: "application/pdf" });
        } catch {
            // 혹시 arrayBuffer가 막히면 slice로 추출
            blob = file.slice(0, file.size, "application/pdf");
        }

        const url = URL.createObjectURL(blob);
        setPdfUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
        });
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

                <input
                    type="file"
                    accept=".pdf,application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* ✅ object + iframe 병행 (브라우저 호환) */}
                {pdfUrl ? (
                    <div className="w-full h-[70vh] border rounded-xl overflow-hidden">
                        <object data={pdfUrl} type="application/pdf" className="w-full h-full">
                            <iframe src={pdfUrl} className="w-full h-full" />
                        </object>
                    </div>
                ) : (
                    <div className="w-full h-[40vh] grid place-items-center border rounded-xl text-gray-500">
                        PDF를 선택하면 여기에서 미리보기됩니다.
                    </div>
                )}
            </div>
        </div>
    );
}
