"use client";
import { data } from "./SimpleFilter.hooks";
import { useSimpleTagStore } from "@/store/simpleTagStore";

export default function SimpleFilter({ skipReset = false }: { skipReset?: boolean }) {
    const { simpleTag, setSimpleTag } = useSimpleTagStore();

    const handleSelect = (type: string, grade: string) => {
        setSimpleTag(type, grade, skipReset);
    };

    return (
        <div className="p-0 sm:p-10 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-8 gap-1 sm:gap-5 ">
                {data.map((truck) => {
                    const grades = truck.grades[0].split(", ");
                    const isSelected = simpleTag?.type === truck.type;

                    return (
                        <div key={truck.type} className="bg-white p-2 shadow-md rounded-lg">
                            <div className="font-bold text-sm sm:text-lg mb-4 text-center">{truck.type}</div>
                            <div className="flex flex-wrap gap-1 sm:gap-1 justify-center">
                                {grades.map((grade) => (
                                    <button
                                        key={grade}
                                        onClick={() => handleSelect(truck.type, grade)}
                                        className={`p-1 transition transform duration-200 active:scale-95 cursor-pointer text-lg font-medium 
                                            ${
                                                isSelected && simpleTag?.grade === grade
                                                    ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                                                    : "bg-[#2E7D32]/10 text-[#2E7D32] border-transparent"
                                            }
                                        `}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
