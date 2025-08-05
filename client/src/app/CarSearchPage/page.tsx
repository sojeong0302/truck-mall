"use client";

import SimpleFilter from "@/components/SimpleFilter";
import Filter from "@/components/Filter";
import Sns from "@/components/Sns";
import ShortButton from "@/components/ShortButton";
import { useState } from "react";
import { Range } from "react-range";
import Sale from "@/components/Sale";
import { useSearchTriggerStore } from "@/store/searchTriggerStore";

const YearMIN = 2000;
const YearMAX = new Date().getFullYear();

const PriceMIN = 100;
const PriceMAX = 10000;

export default function CarSearchPage() {
    const [price, setPrice] = useState([100, 10000]);
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState([2000, currentYear]);
    const [selected, setSelected] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { fire } = useSearchTriggerStore();
    const [transmission, setTransmission] = useState("");

    const handleInputChange = (type: "price" | "year", index: number, newValue: string) => {
        const num = Number(newValue.replace(/[^0-9]/g, ""));

        const min = type === "price" ? PriceMIN : YearMIN;
        const max = type === "price" ? PriceMAX : YearMAX;

        const clamped = Math.min(Math.max(num, min), max);
        const updated = type === "price" ? [...price] : [...year];
        updated[index] = clamped;

        if (updated[0] > updated[1]) {
            updated[1] = updated[0];
        }

        type === "price" ? setPrice(updated) : setYear(updated);
    };

    const handleSelect = (item: string) => {
        setSelected(item);
        setTransmission(item === "전체" ? "" : item); // ✅ 필터 상태에 저장
        setIsOpen(false);
    };

    const handleSubmit = () => {
        fire();
    };

    const handleReset = () => {
        setPrice([PriceMIN, PriceMAX]);
        setYear([YearMIN, YearMAX]);
        setSelected("");
        setTransmission("");
        fire(); // 다시 fetch하게
    };

    return (
        <div className="w-[100%] flex flex-col items-center">
            <SimpleFilter />
            <div className="w-[80%]">
                <Filter />
            </div>
            <div className="flex w-[100%] justify-center gap-10 p-25">
                <Sns />
                <div className="border-[5px] border-[#2E7D32] w-[80%] flex flex-col p-10 justify-between rounded-4xl">
                    {/* 차량 가격 */}
                    <div className="flex w-full ">
                        <div className="w-[30%] flex items-center gap-3">
                            <div className="text-lg text-[#2E7D32]">▶</div>
                            <div className="text-2xl font-medium">차량가격</div>
                        </div>
                        <div className="w-full flex items-center">
                            <Range
                                step={100}
                                min={PriceMIN}
                                max={PriceMAX}
                                values={price}
                                onChange={(vals) => setPrice(vals)}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = price;
                                    const percentLeft = ((minVal - PriceMIN) / (PriceMAX - PriceMIN)) * 100;
                                    const percentRight = ((maxVal - PriceMIN) / (PriceMAX - PriceMIN)) * 100;

                                    return (
                                        <div
                                            {...props}
                                            className="h-2 rounded-full my-4 relative w-[90%] bg-gray-300"
                                            style={props.style}
                                        >
                                            {/* 선택된 바 영역 */}
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
                                    const { key, ...restProps } = props; // key는 따로 빼내고
                                    return (
                                        <div
                                            key={index}
                                            className="w-5 h-5 rounded-full bg-[#2E7D32] shadow-md"
                                            {...restProps}
                                        />
                                    ); // key는 직접 지정
                                }}
                            />
                        </div>
                        <div className="text-3xl font-medium text-[#2E7D32] flex items-center gap-4">
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={price[0]}
                                onChange={(e) => handleInputChange("price", 0, e.target.value)}
                                min={PriceMIN}
                                max={PriceMAX}
                            />
                            ~
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={price[1]}
                                onChange={(e) => handleInputChange("price", 1, e.target.value)}
                                min={PriceMIN}
                                max={PriceMAX}
                            />
                            <span className="text-xl whitespace-nowrap">만원</span>
                        </div>
                    </div>

                    {/* 차량 년식 */}
                    <div className="flex w-full">
                        <div className="w-[30%] flex items-center gap-3">
                            <div className="text-lg text-[#2E7D32]">▶</div>
                            <div className="text-2xl font-medium">차량년식</div>
                        </div>
                        <div className="w-full flex items-center">
                            <Range
                                step={1}
                                min={YearMIN}
                                max={YearMAX}
                                values={year}
                                onChange={(vals) => setYear(vals)}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = year;
                                    const percentLeft = ((minVal - YearMIN) / (YearMAX - YearMIN)) * 100;
                                    const percentRight = ((maxVal - YearMIN) / (YearMAX - YearMIN)) * 100;

                                    return (
                                        <div
                                            {...props}
                                            className="h-2 rounded-full my-4 relative w-[90%] bg-gray-300"
                                            style={props.style}
                                        >
                                            {/* 선택된 바 영역 */}
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
                                    const { key, ...restProps } = props; // key는 따로 빼내고
                                    return (
                                        <div
                                            className="w-5 h-5 rounded-full bg-[#2E7D32] shadow-md"
                                            key={index}
                                            {...restProps}
                                        />
                                    ); // key는 직접 지정
                                }}
                            />
                        </div>
                        <div className="text-3xl font-medium text-[#2E7D32] flex items-center gap-4">
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={year[0]}
                                onChange={(e) => handleInputChange("year", 0, e.target.value)}
                                min={YearMIN}
                                max={YearMAX}
                            />
                            ~
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={year[1]}
                                onChange={(e) => handleInputChange("year", 1, e.target.value)}
                                min={YearMIN}
                                max={YearMAX}
                            />
                            <span className="text-lg whitespace-nowrap">년도</span>
                        </div>
                    </div>

                    {/* 변속기 */}
                    <div className="flex w-full gap-10">
                        <div className="flex items-center gap-3">
                            <div className="text-lg text-[#2E7D32]">▶</div>
                            <div className="text-2xl font-medium">변속기</div>
                        </div>
                        <div className="relative w-48">
                            <button
                                className="transition transform duration-200 active:scale-95 cursor-pointer w-full text-left border border-[#2E7D32] rounded-md px-3 py-2 text-xl"
                                onClick={() => setIsOpen((prev) => !prev)}
                            >
                                {selected || "전체"}
                            </button>

                            {isOpen && (
                                <ul className="absolute z-10 bg-white border border-[#2E7D32] rounded-md w-full mt-1">
                                    {["전체", "오토", "수동", "세미오토", "무단변속기"].map((item) => (
                                        <li
                                            key={item}
                                            className="px-3 py-2 hover:bg-[#2E7D32]/10 cursor-pointer"
                                            onClick={() => handleSelect(item)}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 justify-end">
                        <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                            검색
                        </ShortButton>
                        <ShortButton onClick={handleReset} className="bg-white border-3 border-[#2E7D32]">
                            초기화
                        </ShortButton>
                    </div>
                </div>
            </div>

            <Sale priceRange={price} yearRange={year} transmission={transmission} basePath="" />
        </div>
    );
}
