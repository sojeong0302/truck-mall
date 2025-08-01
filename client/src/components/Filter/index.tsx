"use client";

import { data } from "./Filter.hooks";
import { useFilterStore } from "./Filter.types";

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
            {/* 상단 타이틀 */}
            <div className="bg-[#2E7D32]/25 text-2xl font-bold text-center py-4 px-2">{title}</div>

            {/* 항목 리스트 */}
            <div className="flex flex-col gap-3 p-4">
                {options.map((option) => (
                    <label key={option} className="cursor-pointer block">
                        {/* 숨겨진 라디오 */}
                        <input
                            type="radio"
                            name={title}
                            value={option}
                            checked={selected === option}
                            onChange={() => onChange(option)}
                            className="peer hidden"
                        />

                        {/* 커스텀 라디오 박스 */}
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

export default function Filter() {
    const { manufacturer, model, subModel, grade, set } = useFilterStore();

    const models = data.find((m) => m.manufacturer === manufacturer)?.models || [];
    const subModels = models.find((m) => m.name === model)?.subModels || [];
    const grades = subModels.find((s) => s.name === subModel)?.grades || [];

    return (
        <div className="flex gap-4">
            <SelectBox
                title="제조사"
                options={data.map((d) => d.manufacturer)}
                selected={manufacturer}
                onChange={(v) => set("manufacturer", v)}
            />
            <SelectBox
                title="모델"
                options={models.map((m) => m.name)}
                selected={model}
                onChange={(v) => set("model", v)}
            />
            <SelectBox
                title="세부모델"
                options={subModels.map((s) => s.name)}
                selected={subModel}
                onChange={(v) => set("subModel", v)}
            />
            <SelectBox title="등급" options={grades} selected={grade} onChange={(v) => set("grade", v)} />
        </div>
    );
}
