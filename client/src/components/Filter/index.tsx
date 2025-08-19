"use client";

import { useFilterTagStore } from "./Filter.hooks";
import { truckFilterData } from "./Filter.datas";

function CheckBoxList({
    title,
    options,
    selected,
    onChange,
}: {
    title: string;
    options: string[];
    selected: string[]; // 체크박스니까 배열
    onChange: (v: string[]) => void;
}) {
    const ALL_LABEL = "전체";
    const mobileOptions = [ALL_LABEL, ...options];

    const handleCheck = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleMobileSelect = (value: string) => {
        if (value === ALL_LABEL) onChange([]);
        else onChange([value]);
    };

    const mobileValue = selected.length === 0 ? ALL_LABEL : selected[0];

    return (
        <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden text-xl">
            <div className="bg-[#2E7D32]/25 text-lg sm:text-2xl font-bold text-center py-2 px-1 sm:py-4 sm:px-2">
                {title}
            </div>
            <div className="p-4 block md:hidden">
                <select
                    value={mobileValue}
                    onChange={(e) => handleMobileSelect(e.target.value)}
                    className="w-full p-3 border-2 border-[#ccc] rounded-lg text-sm sm:text-[1.3rem]"
                >
                    {mobileOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden md:flex flex-col gap-3 p-4">
                {options.map((option) => (
                    <label key={option} className="cursor-pointer block">
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => handleCheck(option)}
                            className="peer hidden"
                        />
                        <div
                            className={`w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 peer-checked:bg-[#2E7D32]/10 peer-checked:border-[#2E7D32] hover:border-[#2E7D32]/70 hover:bg-[#2E7D32]/5 text-[1.5rem] leading-snug transition transform duration-200 active:scale-95`}
                        >
                            {option}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

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
    const ALL_LABEL = "전체";
    const mobileOptions = [ALL_LABEL, ...options];
    const mobileValue = selected === "" ? ALL_LABEL : selected;

    return (
        <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden text-xl">
            <div className="bg-[#2E7D32]/25 text-lg sm:text-2xl font-bold text-center py-2 px-1 sm:py-4 sm:px-2">
                {title}
            </div>
            <div className="p-4 block md:hidden">
                <select
                    value={mobileValue}
                    onChange={(e) => {
                        const v = e.target.value;
                        onChange(v === ALL_LABEL ? "" : v);
                    }}
                    className="w-full p-3 border-2 border-[#ccc] rounded-lg text-sm sm:text-[1.3rem]"
                >
                    {mobileOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

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
                            className={`w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 peer-checked:bg-[#2E7D32]/10 peer-checked:border-[#2E7D32] hover:border-[#2E7D32]/70 hover:bg-[#2E7D32]/5 text-[1.5rem] leading-snug transition transform duration-200 active:scale-95`}
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
    const { draft, setDraftManufacturer, setDraftModel, setDraftSubModel, setDraftGrade } = useFilterTagStore();

    const manufacturer = draft.manufacturer;
    const models = truckFilterData.find((d) => d.manufacturer === manufacturer)?.models || [];

    const model = draft.models[0]?.name || "";
    const subModels = models.find((m) => m.name === model)?.subModels || [];

    const subModel = draft.models[0]?.subModels[0]?.name || "";
    const grades = subModels.find((s) => s.name === subModel)?.grades || [];

    const selectedGrades = draft.models[0]?.subModels[0]?.grades || [];

    return (
        <div className="flex gap-4 flex-col sm:flex-row">
            <SelectBox
                title="제조사"
                options={truckFilterData.map((d) => d.manufacturer)}
                selected={manufacturer}
                onChange={(v) => setDraftManufacturer(v, skipReset)}
            />
            <SelectBox
                title="모델"
                options={models.map((m) => m.name)}
                selected={model}
                onChange={(v) => setDraftModel(v, skipReset)}
            />
            <SelectBox
                title="세부모델"
                options={subModels.map((s) => s.name)}
                selected={subModel}
                onChange={(v) => setDraftSubModel(v, skipReset)}
            />
            <CheckBoxList
                title="등급"
                options={grades}
                selected={selectedGrades}
                onChange={(v) => setDraftGrade(v, skipReset)}
            />
        </div>
    );
}
