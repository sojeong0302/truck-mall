"use client";

import { SaleComponentProps } from "./Sale.types";
import Pagination from "../Pagination";
import { usePaginationStore } from "@/store/paginationStore";
import { dummyData3 } from "@/data/dummy";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const ITEMS_PER_PAGE = 5;

export default function Sale({ posts, basePath }: SaleComponentProps) {
    const { currentPage } = usePaginationStore();

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedData = dummyData3.slice(startIndex, endIndex);

    const totalPages = Math.ceil(dummyData3.length / ITEMS_PER_PAGE);

    const router = useRouter();

    const { isLoggedIn } = useAuthStore();

    const handleGoUpload = () => {
        router.push("/SaleUploadPage");
    };

    return (
        <div className="w-[100%] flex flex-col items-center justify-center">
            <div className="w-[70%] p-3 flex items-center justify-between border-b-2 border-[#575757]">
                <div className="flex items-center gap-3">
                    <div className="text-[#D7263D] text-xl font-medium">등록 매물</div>
                    <div className="text-base">허위 없은 100% 실매물만 등록됩니다.</div>
                </div>
                {isLoggedIn && (
                    <div className="text-sm">
                        <div onClick={handleGoUpload} className="cursor-pointer">
                            등록하기
                        </div>
                    </div>
                )}
            </div>

            <div className="w-[70%] flex flex-col gap-5 p-10 ">
                {pagedData.map((post, idx) => (
                    <div
                        onClick={() => router.push(`/SaleDetailPage/${post.id}`)}
                        key={idx}
                        className="flex w-full p-3 justify-between items-center cursor-pointer"
                    >
                        {post.thumbnail && (
                            <img
                                src={post.thumbnail}
                                alt="썸네일"
                                className="shadow-lg rounded-xl w-[25%] h-auto min-w-[150px]"
                            />
                        )}
                        <div className="text-xl font-semibold flex flex-col gap-3">
                            <div>모델: {post.name}</div>
                            <div>연료: {post.fuel}</div>
                            <div>연식: {post.year}</div>
                            <div>주행: {post.mileage}</div>
                        </div>
                        <div className="text-xl font-semibold">{post.price?.toLocaleString()}원</div>
                        <div className="text-xl font-semibold">상담문의: 010-8191-8244</div>
                        <div>
                            <div
                                className={`flex justify-center shadow-lg text-2xl  w-[120px]  p-2.5 rounded-md font-medium text-white ${
                                    post.status ? "bg-[#2E7D32]" : "bg-[#C62828]"
                                }`}
                            >
                                {post.status ? "판매중" : "판매완료"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination totalPages={totalPages} />
        </div>
    );
}
