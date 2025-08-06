"use client";

import { SaleComponentProps } from "./Sale.types";
import Pagination from "../Pagination";
import { usePaginationStore } from "@/store/paginationStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { SaleProps } from "./Sale.types";
import axios from "axios";
import { useFilterTagStore } from "@/components/Filter/Filter.types";
import { useSimpleTagStore } from "@/store/simpleTagStore";
import { useSearchTriggerStore } from "@/store/searchTriggerStore";

const ITEMS_PER_PAGE = 5;

export default function Sale({ transmission, posts, priceRange, yearRange }: SaleComponentProps) {
    const { currentPage } = usePaginationStore();
    const { simpleTag } = useSimpleTagStore();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const { manufacturer, model, subModel, grade } = useFilterTagStore();
    const { trigger } = useSearchTriggerStore();
    const router = useRouter();

    const { isLoggedIn } = useAuthStore();

    const handleGoUpload = () => {
        router.push("/SaleUploadPage");
    };

    const [sales, setSales] = useState<SaleProps[]>([]);
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const query = new URLSearchParams();
                if (simpleTag) {
                    // ✅ null 체크
                    query.append("simple_type", simpleTag.type);
                    query.append("simple_grade", simpleTag.grade);
                }

                if (priceRange) {
                    query.append("min_price", String(priceRange[0]));
                    query.append("max_price", String(priceRange[1]));
                }
                if (yearRange) {
                    query.append("min_year", String(yearRange[0]));
                    query.append("max_year", String(yearRange[1]));
                }

                if (transmission) {
                    query.append("transmission", transmission);
                }

                // ✅ 일반 Filter 조건
                if (manufacturer) query.append("manufacturer", manufacturer);
                if (model) query.append("model", model);
                if (subModel) query.append("sub_model", subModel);
                if (grade) query.append("grade", grade);
                const res = await axios.get(`http://localhost:5000/sale/list?${query.toString()}`);
                const safeData = res.data ?? [];
                setSales(Array.isArray(safeData) ? safeData : []);
            } catch (err) {
                setSales([]);
            }
        };

        fetchSales();
    }, [simpleTag, trigger]);

    const pagedData = sales.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);

    return (
        <div className="w-[100%] flex flex-col items-center justify-center">
            <div className="w-[90%] sm:w-[70%] p-3 flex items-center justify-between border-b-2 border-[#575757]">
                <div className="flex items-center gap-3">
                    <div className="text-[#D7263D] text-sm sm:text-xl font-medium">등록 매물</div>
                    <div className="hidden sm:block text-base">허위 없은 100% 실매물만 등록됩니다.</div>
                </div>
                {isLoggedIn && (
                    <div className="text-sm">
                        <div onClick={handleGoUpload} className="cursor-pointer">
                            등록하기
                        </div>
                    </div>
                )}
            </div>

            <div className="w-[90%] sm:w-[70%] flex flex-col gap-5 p-1 sm:p-10 ">
                {pagedData.map((post, idx) => (
                    <div
                        onClick={() => router.push(`/SaleDetailPage/${post.id}`)}
                        key={idx}
                        className="flex w-full p-3 justify-between items-center cursor-pointer"
                    >
                        <div className="hidden sm:block w-[25%] h-[180px] min-w-[150px] rounded-xl shadow-lg flex items-center justify-center bg-gray-100 overflow-hidden">
                            {post.thumbnail ? (
                                <img src={post.thumbnail} alt="썸네일" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-500 text-sm">이미지 준비중 입니다.</span>
                            )}
                        </div>

                        <div className="text-sm sm:text-xl font-semibold flex flex-col gap-3">
                            <div className="truncate max-w-[100px] sm:max-w-[200px]">모델: {post.name}</div>
                            <div className="truncate max-w-[100px]">연료: {post.fuel}</div>
                            <div className="truncate max-w-[100px]">연식: {post.year}</div>
                            <div className="truncate max-w-[100px]">주행: {post.mileage}</div>
                        </div>
                        <div className="text-sm sm:text-xl font-semibold">{post.price?.toLocaleString()}만원</div>
                        <div className="hidden sm:block text-xl font-semibold">상담문의: 010-8191-8244</div>
                        <div>
                            <div
                                className={`flex justify-center shadow-lg text-sm sm:text-2xl  w-[80px] sm:w-[120px]  p-2.5 rounded-md font-medium text-white ${
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
