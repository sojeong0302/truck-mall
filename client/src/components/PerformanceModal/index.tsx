"use client";

import { useRef, useState, useEffect } from "react";
import ShortButton from "../ShortButton";
import { usePerformanceModal } from "./PerformanceModal.hooks";

export default function PerformanceModal() {
    const { isOpen, close, setPdfFile } = usePerformanceModal();
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

        const isPdfName = /\.pdf$/i.test(file.name);
        const looksLikePdf = isPdfName || file.type === "application/pdf" || file.type.includes("pdf");
        if (!looksLikePdf) {
            alert("PDF만 선택 가능합니다.");
            e.currentTarget.value = "";
            return;
        }

        // 미리보기용 Blob(URL)
        const buf = await file.arrayBuffer();
        const blob = new Blob([buf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
        });

        // ✅ 업로드용 원본 File은 Zustand에 보관
        setPdfFile(file);
    };

    return (
        <div className="fixed inset-0 z-[1000] grid place-items-center">
            <div className="absolute inset-0 bg-black/40" onClick={close} />
            <div className="relative z-10 w-[92vw] max-w-none rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-semibold">성능점검표</div>
                    <button onClick={close} className="cursor-pointer text-2xl text-gray-500">
                        x
                    </button>
                </div>

                <div className="flex gap-2 mb-4">
                    <ShortButton className="bg-[#2E7D32] text-white" onClick={handleOpenFileDialog}>
                        PDF 선택
                    </ShortButton>
                </div>

                <input
                    type="file"
                    accept=".pdf,application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
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
