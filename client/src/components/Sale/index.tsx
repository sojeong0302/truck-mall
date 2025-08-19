"use client";

import { SaleComponentProps } from "./Sale.hooks";
import Pagination from "../Pagination";
import { usePaginationStore } from "@/store/paginationStore";
import { useRouter } from "next/navigation";
import { useAuthToggle } from "../Header/Header.hooks";
import { useEffect, useMemo } from "react";
import { useFilterTagStore } from "@/components/Filter/Filter.hooks";
import { useSimpleTagStore } from "@/store/simpleTagStore";
import { useSearchTriggerStore } from "@/store/searchTriggerStore";
import { useSaleStore } from "@/store/saleStore";
import { getImageUrl } from "@/utils/getImageUrl";
import { api } from "@/lib/api";

const YearMIN = 2000;
const YearMAX = new Date().getFullYear();
const PriceMIN = 100;
const PriceMAX = 10000;
const ITEMS_PER_PAGE = 5;

export default function Sale({ transmission, priceRange, yearRange }: SaleComponentProps) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { currentPage } = usePaginationStore();
    const { isLoggedIn, toggleAuth, isHydrated } = useAuthToggle();
    const { simpleTag } = useSimpleTagStore();
    const { trigger } = useSearchTriggerStore();
    const { sales, setSales, clearSales } = useSaleStore();
    const isDefaultPrice = !priceRange || (priceRange[0] === PriceMIN && priceRange[1] === PriceMAX);
    const isDefaultYear = !yearRange || (yearRange[0] === YearMIN && yearRange[1] === YearMAX);
    const { draft } = useFilterTagStore();

    const manufacturer = draft.manufacturer;
    const model = draft.models[0]?.name || "";
    const subModel = draft.models[0]?.subModels[0]?.name || "";
    const grade = draft.models[0]?.subModels[0]?.grades[0] || "";

    // 최초 전체 조회
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await api.get(`${BASE_URL}/sale/list`);
                const data = Array.isArray(res.data) ? res.data : [];
                setSales(data);
            } catch (e) {
                console.error("초기 전체 조회 실패:", e);
                clearSales();
            }
        };
        fetchAll();
    }, []);

    // 검색(trigger) 시 필터 조회
    useEffect(() => {
        const fetchFiltered = async () => {
            try {
                const qs = new URLSearchParams();

                if (simpleTag) {
                    if (simpleTag.type) qs.set("simple_type", simpleTag.type);
                    if (simpleTag.grade) qs.set("simple_grade", simpleTag.grade);
                }
                if (!isDefaultPrice && priceRange) {
                    qs.set("min_price", String(priceRange[0]));
                    qs.set("max_price", String(priceRange[1]));
                }
                if (!isDefaultYear && yearRange) {
                    qs.set("min_year", String(yearRange[0]));
                    qs.set("max_year", String(yearRange[1]));
                }
                if (transmission) qs.set("transmission", transmission);
                if (manufacturer) qs.set("manufacturer", manufacturer);
                if (model) qs.set("model", model);
                if (subModel) qs.set("sub_model", subModel);
                if (grade) qs.set("grade", grade);

                const url = qs.toString() ? `${BASE_URL}/sale/list?${qs.toString()}` : `${BASE_URL}/sale/list`;

                const res = await api.get(url);
                const data = Array.isArray(res.data) ? res.data : [];
                setSales(data);
            } catch (err) {
                console.error("필터 조회 실패:", err);
                clearSales();
            }
        };

        fetchFiltered();
    }, [
        trigger,
        transmission,
        priceRange,
        yearRange,
        simpleTag,
        manufacturer,
        model,
        subModel,
        grade,
        BASE_URL,
        setSales,
        clearSales,
    ]);

    // 페이지네이션
    const pagedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return sales.slice(startIndex, endIndex);
    }, [sales, currentPage]);

    const totalPages = useMemo(() => Math.ceil(sales.length / ITEMS_PER_PAGE), [sales]);
    const handleGoUpload = () => router.push("/SaleUploadPage");

    return (
        <div className="w-[100%] flex flex-col items-center justify-center">
            <div className="w-[90%] sm:w-[70%] p-3 flex items-center justify-between border-b-2 border-[#575757]">
                <div className="flex items-center gap-3">
                    <div className="text-[#D7263D] text-sm sm:text-xl font-medium">등록 매물</div>
                    <div className="hidden sm:block text-base">허위 없는 100% 실매물만 등록됩니다.</div>
                </div>
                {isLoggedIn && (
                    <div className="text-sm">
                        <div onClick={handleGoUpload} className="cursor-pointer">
                            등록하기
                        </div>
                    </div>
                )}
            </div>

            <div className="w-[90%] sm:w-[70%] flex flex-col gap-5 p-1 sm:p-5 ">
                {pagedData.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-10">등록된 매물이 없습니다.</div>
                ) : (
                    pagedData.map((post, idx) => (
                        <div
                            onClick={() => router.push(`/SaleDetailPage/${post.id}`)}
                            key={idx}
                            className="flex w-full justify-between items-center cursor-pointer"
                        >
                            <div className="sm:w-[20%] sm:h-[180px] w-[15%] h-[100px] min-w-[100px] sm:min-w-[120px] rounded-xl shadow-lg flex items-center justify-center bg-gray-100 overflow-hidden">
                                {post.thumbnail && !post.thumbnail.startsWith("blob:") ? (
                                    <img
                                        src={getImageUrl(post.thumbnail)}
                                        alt="썸네일"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex w-full h-full items-center justify-center text-xs sm:text-sm text-center text-gray-500">
                                        이미지 준비중
                                    </div>
                                )}
                            </div>
                            <div className="sm:w-[55%]hidden sm:block text-sm sm:text-2xl font-semibold flex flex-col gap-3">
                                <div className="">{post.name}</div>
                                <div className="flex gap-5">
                                    <div className="">{post.year}</div>
                                    <div className="">{post.mileage}</div>
                                    <div className="">{post.fuel}</div>
                                </div>
                                <div>{post.simple_content}</div>
                            </div>

                            <div className="sm:w-[15%] max-w-[110px] sm:max-w-[250px] text-sm sm:text-xl font-semibold flex flex-col gap-1">
                                <div className="fade-truncate sm:hidden">{post.name}</div>
                                <div className="fade-truncate sm:hidden">연식: {post.year}</div>
                                <div className="fade-truncate sm:hidden">주행: {post.mileage}</div>
                                <div>{post.price?.toLocaleString()}만원</div>
                            </div>
                            <div className="sm:w-[15%]">
                                <div
                                    className={`flex justify-center shadow-lg text-xs sm:text-xl w-[60px] sm:w-[100px] p-1.5 sm:p-2.5 rounded-md font-medium text-white ${
                                        post.status ? "bg-[#2E7D32]" : "bg-[#C62828]"
                                    }`}
                                >
                                    {post.status ? "판매중" : "판매완료"}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Pagination totalPages={totalPages} />
        </div>
    );
}
