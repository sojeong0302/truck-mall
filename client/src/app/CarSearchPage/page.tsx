"use client";

import SimpleFilter from "@/components/SimpleFilter";
import Filter from "@/components/Filter";
import Sns from "@/components/Sns";
import ShortButton from "@/components/ShortButton";
import { useState } from "react";
import { Range } from "react-range";
import Sale from "@/components/Sale";
import { dummyData3 } from "@/data/dummy";

const MIN = 0;
const MAX = 10000;

export default function CarSearchPage() {
    const [price, setPrice] = useState([1000, 7000]);
    const [year, setYear] = useState([1000, 7000]);
    const [selected, setSelected] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (type: "price" | "year", index: number, newValue: string) => {
        const num = Number(newValue.replace(/[^0-9]/g, ""));
        const clamped = Math.min(Math.max(num, MIN), MAX);

        const updated = type === "price" ? [...price] : [...year];
        updated[index] = clamped;

        if (updated[0] > updated[1]) {
            updated[1] = updated[0];
        }

        type === "price" ? setPrice(updated) : setYear(updated);
    };

    const handleSelect = (item: string) => {
        setSelected(item);
        setIsOpen(false); // 선택 후 닫기
    };

    const handleSubmit = () => {
        alert("등록 되었습니다.");
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
                    <div className="flex w-full ">
                        <div className="w-[30%] flex items-center gap-3">
                            <div className="text-lg text-[#2E7D32]">▶</div>
                            <div className="text-2xl font-medium">차량가격</div>
                        </div>
                        <div className="w-full flex items-center">
                            <Range
                                step={100}
                                min={MIN}
                                max={MAX}
                                values={price}
                                onChange={(vals) => setPrice(vals)}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = price;
                                    const percentLeft = ((minVal - MIN) / (MAX - MIN)) * 100;
                                    const percentRight = ((maxVal - MIN) / (MAX - MIN)) * 100;

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
                                    return <div key={index} {...restProps} />; // key는 직접 지정
                                }}
                            />
                        </div>
                        <div className="text-3xl font-medium text-[#2E7D32] flex items-center gap-4">
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={price[0]}
                                onChange={(e) => handleInputChange("price", 0, e.target.value)}
                                min={MIN}
                                max={MAX}
                            />
                            ~
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={price[1]}
                                onChange={(e) => handleInputChange("price", 1, e.target.value)}
                                min={MIN}
                                max={MAX}
                            />
                            <span className="text-xl whitespace-nowrap">만원</span>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-[30%] flex items-center gap-3">
                            <div className="text-lg text-[#2E7D32]">▶</div>
                            <div className="text-2xl font-medium">차량년식</div>
                        </div>
                        <div className="w-full flex items-center">
                            <Range
                                step={100}
                                min={MIN}
                                max={MAX}
                                values={year}
                                onChange={(vals) => setYear(vals)}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = year;
                                    const percentLeft = ((minVal - MIN) / (MAX - MIN)) * 100;
                                    const percentRight = ((maxVal - MIN) / (MAX - MIN)) * 100;

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
                                renderThumb={({ props, isDragged }) => (
                                    <div
                                        {...props}
                                        className="relative flex items-center justify-center focus:outline-none outline-none"
                                    >
                                        {/* 드래그 중일 때만 은은한 퍼짐 */}
                                        <div
                                            className={`absolute w-6 h-6 rounded-full bg-[#2E7D32]/20 transition-all duration-200 ${
                                                isDragged ? "scale-150" : "scale-0"
                                            }`}
                                        />

                                        {/* 중심 동그라미 */}
                                        <div className="w-5 h-5 bg-[#2E7D32] rounded-full z-10" />
                                    </div>
                                )}
                            />
                        </div>
                        <div className="text-3xl font-medium text-[#2E7D32] flex items-center gap-4">
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={year[0]}
                                onChange={(e) => handleInputChange("year", 0, e.target.value)}
                                min={MIN}
                                max={MAX}
                            />
                            ~
                            <input
                                type="number"
                                className="border border-[#2E7D32] rounded-md px-3 py-1 w-32 text-xl text-right"
                                value={year[1]}
                                onChange={(e) => handleInputChange("year", 1, e.target.value)}
                                min={MIN}
                                max={MAX}
                            />
                            <span className="text-lg whitespace-nowrap">년도</span>
                        </div>
                    </div>
                    <div className="flex w-full gap-10">
                        <div className="flex items-center gap-3">
                            <div className="text-lg text-[#2E7D32]">▶</div>
                            <div className="text-2xl font-medium">변속기</div>
                        </div>
                        <div className="relative w-48">
                            <button
                                className="transition transform duration-200 active:scale-95 cursor-pointer w-full text-left border border-[#2E7D32] rounded-md px-3 py-2 text-xl"
                                onClick={() => setIsOpen((prev) => !prev)} // 토글
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
                    <div className="flex gap-3 justify-end">
                        <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                            검색
                        </ShortButton>
                        <ShortButton onClick={handleSubmit} className="bg-white border-3 border-[#2E7D32]">
                            초기화
                        </ShortButton>
                    </div>
                </div>
            </div>
            <Sale posts={dummyData3} basePath="" />
        </div>
    );
}
