"use client";

import SimpleFilter from "@/components/SimpleFilter";
import Filter from "@/components/Filter";
import Sns from "@/components/Sns";
import ShortButton from "@/components/ShortButton";
import { Range } from "react-range";
import Sale from "@/components/Sale";
import { useSearchTriggerStore } from "@/store/searchTriggerStore";
import { useSearchFilterStore, PriceMIN, PriceMAX, YearMIN, YearMAX } from "./CarSearchPage.types";
import { useFilterTagStore } from "@/components/Filter/Filter.types"; // ✅ 추가
import { usePaginationStore } from "@/store/paginationStore"; // ✅ 추가
import { useCallback } from "react";

export default function CarSearchPage() {
    const { fire } = useSearchTriggerStore();

    const {
        isOpen,
        toggleOpen,
        draftSelectedLabel,
        handleSelectDraft,
        draftPrice,
        setDraftPrice,
        handleInputChangeDraft,
        draftYear,
        setDraftYear,
        price,
        year,
        transmission,
        applyFilters,
        resetAll,
    } = useSearchFilterStore();

    const applyFilterTags = useFilterTagStore((s) => s.applyDraft); // ✅ Filter(draft) → applied
    const clearFilterTags = useFilterTagStore((s) => s.clearAll); // ✅ draft+applied 초기화
    const { setPage } = usePaginationStore();

    const handleSubmit = useCallback(() => {
        applyFilterTags(); // ✅ 제조사/모델/세부/등급 적용
        applyFilters(); // ✅ 가격/연식/변속기 적용
        setPage(1); // ✅ 1페이지로
        fire(); // ✅ 목록 조회 트리거
    }, [applyFilterTags, applyFilters, setPage, fire]);

    const handleReset = useCallback(() => {
        resetAll(); // 가격/연식/변속기 초기화
        clearFilterTags(); // Filter 초기화(draft+applied)
        setPage(1);
        fire();
    }, [resetAll, clearFilterTags, setPage, fire]);

    // 인풋에서 Enter 누르면 바로 검색 (선택)
    const onKeyDownSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") handleSubmit();
    };
    return (
        <div className="w-[100%] flex flex-col items-center">
            <div className="hidden md:block">
                <SimpleFilter />
            </div>
            <div className="w-[80%]">
                <Filter />
            </div>
            <div className="flex w-[100%] justify-center gap-10 p-5 sm:p-25 items-stretch">
                <div className="hidden md:flex self-stretch">
                    <Sns className="h-full" />
                </div>
                <div className="border-[5px] border-[#2E7D32] w-[100%] sm:w-[80%] flex flex-col p-10 gap-5 sm:justify-between rounded-4xl self-stretch">
                    {/* 차량 가격 */}
                    <div className="flex w-full flex-col sm:flex-row">
                        <div className="w-[100%] sm:w-[30%] flex items-center gap-3">
                            <div className="text-sm sm:text-lg text-[#2E7D32]">▶</div>
                            <div className="text-lg sm:text-2xl font-medium">차량가격</div>
                        </div>
                        <div className="w-full flex items-center">
                            <Range
                                step={100}
                                min={PriceMIN}
                                max={PriceMAX}
                                values={draftPrice}
                                onChange={(vals) => setDraftPrice(vals as [number, number])}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = draftPrice;
                                    const percentLeft = ((minVal - PriceMIN) / (PriceMAX - PriceMIN)) * 100;
                                    const percentRight = ((maxVal - PriceMIN) / (PriceMAX - PriceMIN)) * 100;

                                    return (
                                        <div
                                            {...props}
                                            className="h-2 rounded-full my-4 relative w-[90%] bg-gray-300"
                                            style={props.style}
                                        >
                                            <div
                                                className="absolute h-full rounded-full bg-[#2E7D32]"
                                                style={{
                                                    left: `${percentLeft}%`,
                                                    width: `${percentRight - percentLeft}%`,
                                                }}
                                            />
                                            {children}
                                        </div>
                                    );
                                }}
                                renderThumb={({ props, index }) => {
                                    const { key, ...restProps } = props;
                                    return (
                                        <div
                                            key={index}
                                            className="w-5 h-5 rounded-full bg-[#2E7D32] shadow-md"
                                            {...restProps}
                                        />
                                    );
                                }}
                            />
                        </div>
                        <div className="text-3xl font-medium text-[#2E7D32] flex items-center gap-4">
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-sm sm:text-xl text-right"
                                value={draftPrice[0]}
                                onChange={(e) => handleInputChangeDraft("price", 0, e.target.value)}
                                min={PriceMIN}
                                max={PriceMAX}
                            />
                            ~
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-sm sm:text-xl text-right"
                                value={draftPrice[1]}
                                onChange={(e) => handleInputChangeDraft("price", 1, e.target.value)}
                                min={PriceMIN}
                                max={PriceMAX}
                            />
                            <span className="text-lg whitespace-nowrap hidden md:inline">만원</span>
                        </div>
                    </div>

                    {/* 차량 년식 */}
                    <div className="flex w-full flex-col sm:flex-row">
                        <div className="w-[100%] sm:w-[30%] flex items-center gap-3 ">
                            <div className="text-sm sm:text-lg text-[#2E7D32]">▶</div>
                            <div className="text-lg sm:text-2xl font-medium">차량년식</div>
                        </div>
                        <div className="w-full flex items-center">
                            <Range
                                step={1}
                                min={YearMIN}
                                max={YearMAX}
                                values={draftYear}
                                onChange={(vals) => setDraftYear(vals as [number, number])}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = draftYear;
                                    const percentLeft = ((minVal - YearMIN) / (YearMAX - YearMIN)) * 100;
                                    const percentRight = ((maxVal - YearMIN) / (YearMAX - YearMIN)) * 100;

                                    return (
                                        <div
                                            {...props}
                                            className="h-2 rounded-full my-4 relative w-[90%] bg-gray-300"
                                            style={props.style}
                                        >
                                            <div
                                                className="absolute h-full rounded-full bg-[#2E7D32]"
                                                style={{
                                                    left: `${percentLeft}%`,
                                                    width: `${percentRight - percentLeft}%`,
                                                }}
                                            />
                                            {children}
                                        </div>
                                    );
                                }}
                                renderThumb={({ props, index }) => {
                                    const { key, ...restProps } = props;
                                    return (
                                        <div
                                            className="w-5 h-5 rounded-full bg-[#2E7D32] shadow-md"
                                            key={index}
                                            {...restProps}
                                        />
                                    );
                                }}
                            />
                        </div>
                        <div className="text-3xl font-medium text-[#2E7D32] flex items-center gap-4">
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-sm sm:text-xl text-right"
                                value={draftYear[0]}
                                onChange={(e) => handleInputChangeDraft("year", 0, e.target.value)}
                                min={YearMIN}
                                max={YearMAX}
                            />
                            ~
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-sm sm:text-xl text-right"
                                value={draftYear[1]}
                                onChange={(e) => handleInputChangeDraft("year", 1, e.target.value)}
                                min={YearMIN}
                                max={YearMAX}
                            />
                            <span className="text-lg whitespace-nowrap hidden md:inline">년도</span>
                        </div>
                    </div>

                    {/* 변속기 */}
                    <div className="flex w-full gap-0 sm:gap-3 flex-col sm:flex-col">
                        <div className="flex items-center gap-3">
                            <div className="text-sm sm:text-lg text-[#2E7D32]">▶</div>
                            <div className="text-lg sm:text-2xl font-medium">변속기</div>
                        </div>
                        <div className="relative w-48">
                            <button
                                className="transition transform duration-200 active:scale-95 cursor-pointer w-full text-left border border-[#2E7D32] rounded-md px-3 py-2 text-sm sm:text-xl"
                                onClick={toggleOpen}
                            >
                                {draftSelectedLabel || "전체"}
                            </button>

                            {isOpen && (
                                <ul className="absolute z-10 bg-white border border-[#2E7D32] rounded-md w-full mt-1">
                                    {["전체", "오토", "수동", "세미오토", "무단변속기"].map((item) => (
                                        <li
                                            key={item}
                                            className="px-3 py-2 hover:bg-[#2E7D32]/10 cursor-pointer"
                                            onClick={() => handleSelectDraft(item)}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 sm:justify-end justify-center">
                        <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                            검색
                        </ShortButton>
                        <ShortButton onClick={handleReset} className="bg-white border-3 border-[#2E7D32]">
                            초기화
                        </ShortButton>
                    </div>
                </div>
            </div>
            <Sale priceRange={price} yearRange={year} transmission={transmission} />
        </div>
    );
}
