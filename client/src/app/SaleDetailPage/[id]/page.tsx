"use client";

import { use, useEffect, useState } from "react";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";
import { SaleProps } from "@/components/Sale/Sale.types";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [post, setPost] = useState<SaleProps | null>(null);
    const { isLoggedIn } = useAuthStore();
    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/sale/${id}`);
                setPost(res.data);
            } catch (err) {}
        };

        fetchPost();
    }, [id]);

    const handleGoCrystal = () => {
        router.push(`/SaleCrystalPage/${id}`);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/sale/${id}`, {
                method: "DELETE",
            });
            setIsModalOpen(true);
        } catch (error) {}
    };

    if (!post) return <div className="p-10 text-red-500">해당 게시물을 찾을 수 없습니다.</div>;
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
                    <img
                        src={post.thumbnail}
                        className="border-1 shadow-lg rounded-xl w-[500px] sm:h-[500px] h-[300px] "
                    />
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
                {post.images && post.images.length > 0 && <SwiperWithLightbox images={post.images} />}
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
