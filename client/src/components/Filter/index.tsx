"use client";

import { data } from "./Filter.hooks";
import { useFilterTagStore } from "./Filter.types";

function SelectBox({
    title,
    options,
    selected,
    onChange,
}: {
    title: string;
    options: string[];
    selected: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden text-xl">
            {/* 타이틀 */}
            <div className="bg-[#2E7D32]/25 text-lg sm:text-2xl font-bold text-center py-2 px-1 sm:py-4 sm:px-2">
                {title}
            </div>

            {/* ✅ 모바일: 드롭다운 */}
            <div className="p-4 block md:hidden">
                <select
                    value={selected}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-3 border-2 border-[#ccc] rounded-lg text-sm sm:text-[1.3rem]"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* ✅ 데스크탑: 기존 라디오 박스 */}
            <div className="hidden md:flex flex-col gap-3 p-4">
                {options.map((option) => (
                    <label key={option} className="cursor-pointer block">
                        <input
                            type="radio"
                            name={title}
                            value={option}
                            checked={selected === option}
                            onChange={() => onChange(option)}
                            className="peer hidden"
                        />
                        <div
                            className={`
                                w-full rounded-lg border-2 px-4 py-3 transition-all duration-200
                                peer-checked:bg-[#2E7D32]/10 peer-checked:border-[#2E7D32]
                                hover:border-[#2E7D32]/70 hover:bg-[#2E7D32]/5
                                text-[1.5rem] leading-snug transition transform duration-200 active:scale-95
                            `}
                        >
                            {option}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default function Filter({ skipReset = false }: { skipReset?: boolean }) {
    const { manufacturer, model, subModel, grade, set } = useFilterTagStore();

    const models = data.find((m) => m.manufacturer === manufacturer)?.models || [];
    const subModels = models.find((m) => m.name === model)?.subModels || [];
    const grades = subModels.find((s) => s.name === subModel)?.grades || [];

    return (
        <div className="flex gap-4 flex-col sm:flex-row">
            <SelectBox
                title="제조사"
                options={data.map((d) => d.manufacturer)}
                selected={manufacturer}
                onChange={(v) => set("manufacturer", v, skipReset)} // ✅ props로 넘김
            />
            <SelectBox
                title="모델"
                options={models.map((m) => m.name)}
                selected={model}
                onChange={(v) => set("model", v, skipReset)}
            />
            <SelectBox
                title="세부모델"
                options={subModels.map((s) => s.name)}
                selected={subModel}
                onChange={(v) => set("subModel", v, skipReset)}
            />
            <SelectBox title="등급" options={grades} selected={grade} onChange={(v) => set("grade", v, skipReset)} />
        </div>
    );
}
