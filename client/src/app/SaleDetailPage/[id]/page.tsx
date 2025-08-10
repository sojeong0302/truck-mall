"use client";

import { use, useEffect } from "react";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useSaleDetailStore } from "./saleDetailStore";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { id } = use(params);
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();
    const { isModalOpen, setIsModalOpen } = useModalStore();

    const { post, loading, error, fetchById, clear } = useSaleDetailStore();

    useEffect(() => {
        fetchById(BASE_URL, id);
        return () => clear();
    }, [BASE_URL, id, fetchById, clear]);

    const handleGoCrystal = () => router.push(`/SaleCrystalPage/${id}`);

    //삭제 api 연동
    const handleDelete = async () => {
        try {
            await fetch(`${BASE_URL}/sale/${id}`, { method: "DELETE" });
            setIsModalOpen(true);
        } catch {}
    };
    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url}`;
    };

    if (loading) return <div className="p-10">불러오는 중…</div>;
    if (error) return <div className="p-10 text-red-500">오류: {error}</div>;
    if (!post) return <div className="p-10 text-red-500">해당 게시물을 찾을 수 없습니다.</div>;
    console.log(post);
    return (
        <div className="w-full flex justify-center flex-col items-center p-5 sm:p-15">
            {isLoggedIn && (
                <div className="flex w-[100%] sm:w-[80%] justify-end gap-2 p-4 text-sm">
                    <div onClick={handleGoCrystal} className="cursor-pointer">
                        수정
                    </div>
                    |
                    <div className="cursor-pointer" onClick={handleDelete}>
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
                    ) : null}
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
                <div className="flex justify-end">
                    <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                        뒤로가기
                    </ShortButton>
                </div>
            </div>
            {isModalOpen && (
                <Modal url={"/CarSearchPage"} text={"삭제된 내용은 복구할 수 없습니다.\n정말 삭제하시겠습니까?"} />
            )}
        </div>
    );
}
