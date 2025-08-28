"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";
import ShortButton from "@/components/ShortButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthToggle } from "@/components/Header/Header.hooks";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useSaleDetailStore } from "./saleDetailStore";
import { useAuthStore } from "@/store/useAuthStore";
import { api, authApi } from "@/lib/api";
import Script from "next/script";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import PerformanceDetail from "@/components/PerformanceModalDetail";
import { openPerformanceDetail } from "@/components/PerformanceModalDetail/PerformanceModalDetail.hooks";

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();

    const { isLoggedIn, toggleAuth, isHydrated } = useAuthToggle();
    const { isModalOpen, setIsModalOpen, isSaleCompleteModalOpen, setIsSaleCompleteModalOpen } = useModalStore();
    const token = useAuthStore((s) => s.token);
    const { post, loading, error, fetchById, clear } = useSaleDetailStore();

    // 🔧 임시 가격(공유 전 미리보기) 상태
    const [shareOpen, setShareOpen] = useState(false);
    const [tempPrice, setTempPrice] = useState<number | null>(null);

    useEffect(() => {
        fetchById(BASE_URL, id);
        return () => clear(); // 언마운트 시 상태 초기화
    }, [id]);

    //수정 페이지 이동 URL
    const handleGoCrystal = () => router.push(`/SaleCrystalPage/${id}`);
    const openShareSheet = () => setShareOpen(true);

    //삭제 API 연동
    const handleDelete = async () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            const here = window.location.pathname + window.location.search;
            requestAnimationFrame(() => {
                router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            });
            return;
        }
        try {
            await api.delete(`${BASE_URL}/sale/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push("/CarSearchPage");
        } catch (err) {}
    };

    //이미지 URL 생성->절대 삭제X
    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url}`;
    };

    //판매완료 API 연동
    const salesCompleted = async () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            const here = window.location.pathname + window.location.search;
            requestAnimationFrame(() => {
                router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            });
            return;
        }

        try {
            await authApi.put(
                `${BASE_URL}/sale/${id}`,
                { status: false },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            useSaleDetailStore.setState((state) => ({
                post: state.post ? { ...state.post, status: false } : state.post,
            }));
            setIsSaleCompleteModalOpen(false);
        } catch (error) {}
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div
                    className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin"
                    style={{ borderTopColor: "#2E7D32" }}
                ></div>
            </div>
        );
    }

    // 🔧 공유용 URL 생성 (preview_price 쿼리 파라미터 적용)
    const makeShareUrl = (override?: number | null) => {
        const url = new URL(window.location.href);
        if (override != null) {
            url.searchParams.set("preview_price", String(override));
        } else {
            url.searchParams.delete("preview_price");
        }
        return url.toString();
    };

    const handleShareSMS = async () => {
        const baseUrl = typeof window !== "undefined" ? makeShareUrl(currentPreview) : "";
        const title = post?.name ? `[매물] ${post.name}` : "새마일 트럭 매물";
        const msg = `${title}\n관심 있으면 확인해보세요!\n${baseUrl}`;
        const body = encodeURIComponent(msg);

        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

        if (isMobile) {
            const smsUrl = isIOS ? `sms:&body=${body}` : `sms:?body=${body}`;
            window.location.href = smsUrl;
            setShareOpen(false);
        } else {
            await navigator.clipboard.writeText(baseUrl);
            alert("링크를 복사했습니다. 모바일에서 문자로 보내주세요.");
        }
    };

    const handleShareKakao = () => {
        const pageUrl = typeof window !== "undefined" ? makeShareUrl(currentPreview) : "";
        const title = post?.name || "새마일 트럭";
        const text = "관심 있으면 확인해보세요!";
        const image = `${BASE_URL}/og.png`;

        const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

        if (!window.Kakao) {
            alert("카카오 SDK가 로드되지 않았습니다. (애드블록/네트워크 확인)");
            return;
        }
        if (!key) {
            alert("Kakao JS 키가 클라이언트에 주입되지 않았습니다. (NEXT_PUBLIC_KAKAO_JS_KEY 확인)");
            return;
        }
        if (!window.Kakao.isInitialized()) {
            try {
                window.Kakao.init(key);
            } catch {}
        }
        if (!window.Kakao.isInitialized()) {
            alert("카카오 공유를 사용할 수 없습니다. (도메인/JS키/초기화 확인)");
            return;
        }

        window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title,
                description: text,
                imageUrl: image,
                link: { webUrl: pageUrl, mobileWebUrl: pageUrl },
            },
            buttons: [
                {
                    title: "자세히 보기",
                    link: { webUrl: pageUrl, mobileWebUrl: pageUrl },
                },
            ],
        });
        setShareOpen(false);
    };
    useEffect(() => {
        if (post) {
            console.log("[DEBUG] post 데이터:", post);
            console.log("성능번호:", post.performance_number);
            console.log("제시번호:", post.suggest_number);
            console.log("가격:", post.price);
        }
    }, [post]);

    if (!post) return <div className="p-10 text-red-500">해당 게시물을 찾을 수 없습니다.</div>;

    // 🔧 수신자 측 표시용: 쿼리의 preview_price가 있으면 표시만 덮어쓰기
    const previewPriceParam = searchParams?.get("preview_price");
    const previewPrice =
        previewPriceParam && !Number.isNaN(Number(previewPriceParam)) ? Number(previewPriceParam) : null;
    const displayPrice = previewPrice ?? post.price;

    // 🔧 공유 전 슬라이더 범위/값 (만원 단위 가정)
    const basePrice = post?.price ?? 0;
    const minPreview = Math.max(0, Math.floor(basePrice * 0.8)); // -20%
    const maxPreview = Math.max(minPreview, Math.ceil(basePrice * 1.2)); // +20%
    const currentPreview = tempPrice ?? basePrice;
    const formatPrice = (v: number) => `${v.toLocaleString()}만원`;

    const openPerformance = () => {
        const no = post?.performance_number;
        if (!no) {
            alert("성능번호가 없습니다.");
            return;
        }
        openPerformanceDetail(no);
    };

    return (
        <div className="w-full h-full flex justify-center flex-col items-center p-5 sm:p-15">
            {isLoggedIn && (
                <div className="flex w-[100%] sm:w-[80%] justify-end gap-2 p-4 text-sm">
                    <div onClick={handleGoCrystal} className="cursor-pointer">
                        수정
                    </div>
                    |
                    <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        삭제
                    </div>
                </div>
            )}
            <div className="w-[95%] h-full sm:w-[80%] flex flex-col sm:gap-15 gap-5">
                <div className="flex gap-5">
                    <div className="w-full h-full font-bold text-2xl sm:text-4xl border-b-2 border-[#575757] p-2">
                        {post.name}
                    </div>
                    <div className="cursor-pointer flex items-center" onClick={openShareSheet}>
                        <img
                            src="/images/sharing.png"
                            alt="공유하기"
                            className="h-7 w-7 transition transform duration-200 hover:scale-110 active:scale-95"
                        />
                    </div>
                </div>
                <div className="w-full h-full flex flex-col sm:flex-row justify-center gap-5 sm:gap-10">
                    {post.thumbnail ? (
                        <img
                            src={getImageUrl(post.thumbnail)}
                            className="border-1 shadow-lg rounded-xl w-full sm:w-[60%] sm:h-[700px] h-[200px]"
                            alt="썸네일"
                        />
                    ) : (
                        <div className="border-1 shadow-lg rounded-xl w-full sm:w-[50%] sm:h-[500px]  h-[300px] flex  items-center justify-center text-sm text-center text-gray-500">
                            이미지 준비중
                        </div>
                    )}

                    <div className="flex flex-col text-xl sm:text-2xl p-2 sm:gap-5 gap-3">
                        {[
                            { label: "연식", value: post.year },
                            { label: "연료", value: post.fuel },
                            { label: "변속기", value: post.transmission },
                            { label: "색상", value: post.color },
                            { label: "주행거리", value: post.mileage },
                            { label: "차대번호", value: post.vin },
                            { label: "제시번호", value: post.performance_number },
                            { label: "성능번호", value: post.suggest_number },
                            { label: "차량번호", value: post.car_number },
                            { label: "가격", value: `${displayPrice}만원`, color: "text-[#C62828]" },
                            { label: "사고정보", value: "성능점검 참조" },
                            { label: "조합번호", value: "경기도자동차매매사업조합\n031-242-8940" },
                        ].map((item, idx) => (
                            <div className="flex gap-3" key={idx}>
                                <div className="font-bold">{item.label}:</div>
                                {item.label === "조합번호" && typeof item.value === "string" ? (
                                    <div className={item.color || ""}>
                                        {item.value.split("\n").map((line: string, i: number) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={item.color || ""}>{item.value}</div>
                                )}
                                {/* ✅ 성능번호 줄에만 버튼 1개 추가 */}
                                {item.label === "성능번호" && (
                                    <button
                                        type="button"
                                        onClick={openPerformance}
                                        className="cursor-pointer px-3 py-1 text-sm rounded-md border-[1.5px] border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition"
                                    >
                                        성능점검보기(클릭)
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {post.images && post.images.length > 0 && (
                    <SwiperWithLightbox images={post.images.map((img) => getImageUrl(img))} />
                )}

                <div className="whitespace-pre text-xl h-[200px] sm:text-2xl w-full bg-white border-4 border-[#2E7D32] p-4 rounded-md">
                    {post.content}
                </div>
                <div className="flex justify-end gap-3">
                    {Boolean(post.status) && isLoggedIn && (
                        <ShortButton
                            onClick={() => setIsSaleCompleteModalOpen(true)}
                            className="bg-[#2E7D32] text-white"
                        >
                            판매완료
                        </ShortButton>
                    )}
                    <ShortButton onClick={() => router.push("/CarSearchPage")} className="bg-[#2E7D32] text-white">
                        목록으로
                    </ShortButton>
                </div>
            </div>
            {isSaleCompleteModalOpen && (
                <Modal onConfirm={salesCompleted} text={"판매완료 처리하시겠습니까?\n이 작업은 되돌릴 수 없습니다."} />
            )}
            {isModalOpen && (
                <Modal onConfirm={handleDelete} text={"삭제된 내용은 복구할 수 없습니다.\n정말 삭제하시겠습니까?"} />
            )}
            {/* 공유 시트 모달 */}
            {shareOpen && (
                <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" onClick={() => setShareOpen(false)}>
                    {/* 배경 */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* 바텀시트 */}
                    <div
                        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl p-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
                        <div className="text-center text-lg font-bold mb-2">공유하기</div>

                        {/* 🔧 가격 미리보기 슬라이더 */}
                        <div className="mt-1 mb-2 p-3 rounded-xl border bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">가격 미리보기</span>
                                <button
                                    type="button"
                                    className="text-xs underline text-gray-600"
                                    onClick={() => setTempPrice(null)} // 원래 가격으로 리셋
                                >
                                    원래 가격으로
                                </button>
                            </div>

                            <div className="text-sm text-gray-700 mb-1">
                                현재: <span className="font-bold text-[#C62828]">{formatPrice(currentPreview)}</span>
                                <span className="ml-2 text-xs text-gray-500">(링크로만 적용)</span>
                            </div>

                            <input
                                type="range"
                                min={minPreview}
                                max={maxPreview}
                                step={10} // 10만원 단위 조절
                                value={currentPreview}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-full"
                            />

                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="number"
                                    min={minPreview}
                                    max={maxPreview}
                                    step={10}
                                    value={currentPreview}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        if (Number.isFinite(v)) {
                                            const clamped = Math.min(Math.max(v, minPreview), maxPreview);
                                            setTempPrice(clamped);
                                        }
                                    }}
                                    className="w-40 rounded-md border px-2 py-1 text-sm"
                                />
                                <span className="text-sm text-gray-500">만원</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3">
                            {/* 문자 */}
                            <button onClick={handleShareSMS} className="flex flex-col items-center gap-2 group">
                                <div className="h-14 w-14 rounded-2xl ring-1 ring-gray-200 shadow-md flex items-center justify-center group-hover:scale-105 transition bg-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7">
                                        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                                    </svg>
                                </div>
                                <span className="text-sm">문자</span>
                            </button>

                            {/* 카카오톡 */}
                            <button
                                onClick={handleShareKakao}
                                aria-label="카카오톡 공유"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="h-14 w-14 rounded-2xl ring-1 ring-gray-200 shadow-md flex items-center justify-center group-hover:scale-105 transition bg-yellow-400 text-black">
                                    <ChatBubbleLeftEllipsisIcon className="w-3/4 h-3/4" />
                                </div>
                                <span className="text-sm">카카오톡</span>
                            </button>
                        </div>

                        <button
                            className="mt-2 w-full rounded-xl border p-3 text-gray-700 hover:bg-gray-50"
                            onClick={() => setShareOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
                integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
                crossOrigin="anonymous"
                strategy="afterInteractive"
                onLoad={() => {
                    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
                    if (typeof window !== "undefined" && window.Kakao && key && !window.Kakao.isInitialized()) {
                        window.Kakao.init(key);
                        console.log("[KAKAO] initialized:", window.Kakao.isInitialized());
                    }
                }}
            />
            <PerformanceDetail />
        </div>
    );
}
