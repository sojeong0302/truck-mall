"use client";

import { useEffect, useMemo } from "react";
import { usePerformanceModal } from "./PerformanceModalDetail.hooks";
import { api } from "@/lib/api"; // 인증 불필요하면 api, 필요하면 authApi
// ↑ 프로젝트의 axios 인스턴스에 맞춰 import

export default function PerformanceDetail() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { isOpen, close, performanceNumber, pdfUrls, setPdfUrls, setLoading, loading, setError, error } =
        usePerformanceModal();

    // 절대 URL 보정
    const resolveUrl = (u: string) => (u?.startsWith("http") ? u : `${BASE_URL}${u}`);

    useEffect(() => {
        const fetchPDF = async () => {
            if (!isOpen || !performanceNumber) return;
            setLoading(true);
            setError(null);
            try {
                // 서버: GET /performance/<number>  →  { performance_number, images: ["...pdf", ...] }
                const { data } = await api.get(`${BASE_URL}/${encodeURIComponent(performanceNumber)}`);
                const urls: string[] = Array.isArray(data?.images) ? data.images : [];
                setPdfUrls(urls);
            } catch (e: any) {
                setError("성능점검표를 불러오지 못했습니다.");
                setPdfUrls([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPDF();
    }, [isOpen, performanceNumber]);
    // 첫 번째 PDF만 표시 (여러 개면 슬라이더/탭 등으로 확장 가능)
    const firstPdf = useMemo(() => (pdfUrls[0] ? resolveUrl(pdfUrls[0]) : null), [pdfUrls]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] grid place-items-center">
            <div className="absolute inset-0 bg-black/40" onClick={close} />
            <div className="relative z-10 w-[96vw] max-w-none rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-semibold">
                        성능점검표 {performanceNumber ? `(${performanceNumber})` : ""}
                    </div>
                    <button onClick={close} className="cursor-pointer text-2xl text-gray-500">
                        x
                    </button>
                </div>

                {loading && <div className="w-full h-[50vh] grid place-items-center text-gray-500">불러오는 중…</div>}

                {!loading && error && (
                    <div className="w-full h-[50vh] grid place-items-center text-red-500">{error}</div>
                )}

                {!loading && !error && firstPdf && (
                    <div className="w-full h-[80vh] border rounded-xl overflow-hidden">
                        <object data={firstPdf} type="application/pdf" className="w-full h-full">
                            <iframe src={firstPdf} className="w-full h-full" />
                        </object>
                    </div>
                )}

                {!loading && !error && !firstPdf && (
                    <div className="w-full h-[50vh] grid place-items-center text-gray-500">
                        등록된 성능점검 PDF가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
