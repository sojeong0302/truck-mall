"use client";

import { use, useEffect } from "react";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";
import { useAuthToggle } from "@/components/Header/Header.hooks";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useSaleDetailStore } from "./saleDetailStore";
import { useAuthStore } from "@/store/useAuthStore";
import { api, authApi } from "@/lib/api";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { id } = use(params);
    const router = useRouter();
    const { isLoggedIn, toggleAuth, isHydrated } = useAuthToggle();
    const { isModalOpen, setIsModalOpen, isSaleCompleteModalOpen, setIsSaleCompleteModalOpen } = useModalStore();
    const token = useAuthStore((s) => s.token);
    const { post, loading, error, fetchById, clear } = useSaleDetailStore();

    useEffect(() => {
        fetchById(BASE_URL, id);
        return () => clear();
    }, [BASE_URL, id, fetchById, clear]);

    //수정 페이지 이동 URL
    const handleGoCrystal = () => router.push(`/SaleCrystalPage/${id}`);

    //삭제 API 연동
    const handleDelete = async () => {
        // 토큰 없으면 로그인 페이지 이동
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
        // 토큰 없으면 로그인 페이지 이동
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

    if (!post) return <div className="p-10 text-red-500">해당 게시물을 찾을 수 없습니다.</div>;

    return (
        <div className="w-full flex justify-center flex-col items-center p-5 sm:p-15">
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
            <div className="w-[95%] sm:w-[80%] flex flex-col sm:gap-15 gap-5">
                <div className="w-full flex flex-col sm:flex-row justify-center gap-5 sm:gap-15">
                    {post.thumbnail ? (
                        <img
                            src={getImageUrl(post.thumbnail)}
                            className="border-1 shadow-lg rounded-xl w-[500px] sm:h-[500px] h-[300px]"
                            alt="썸네일"
                        />
                    ) : (
                        <div className="flex w-full sm:h-[500px] border-1 shadow-lg  rounded-xl h-[300px] items-center justify-center text-sm text-center text-gray-500">
                            이미지 준비중
                        </div>
                    )}
                    <div className="flex flex-col justify-around">
                        <div className="font-bold text-2xl sm:text-4xl border-b-2 border-[#575757] p-2">
                            {post.name}
                        </div>
                        <div className="flex flex-col text-xl sm:text-2xl p-2 sm:gap-5 gap-3">
                            <div className="flex gap-3">
                                <div className="font-bold">연료:</div>
                                <div>{post.fuel}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">차체 타입:</div>
                                <div>{post.type}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">트림:</div>
                                <div>{post.trim}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">연식:</div>
                                <div>{post.year}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">주행거리:</div>
                                <div>{post.mileage}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">색상:</div>
                                <div>{post.color}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">가격:</div>
                                <div className="text-[#C62828]">{post.price}만원</div>
                            </div>
                        </div>
                    </div>
                </div>
                {post.images && post.images.length > 0 && (
                    <SwiperWithLightbox images={post.images.map((img) => getImageUrl(img))} />
                )}

                <div className="text-xl sm:text-2xl w-full bg-white border-4 border-[#2E7D32] p-4 rounded-md">
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
        </div>
    );
}
