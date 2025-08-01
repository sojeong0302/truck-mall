"use client";
import { useState } from "react";
import { data } from "./SimpleFilter.hooks";

export default function SimpleFilter() {
    const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>({});

    const handleSelect = (type: string, grade: string) => {
        setSelectedGrades((prev) => ({
            ...prev,
            [type]: grade,
        }));
    };

    return (
        <div className="p-10 w-full">
            <div className="grid grid-cols-8 gap-6">
                {data.map((truck) => {
                    const grades = truck.grades[0].split(", ");
                    const selected = selectedGrades[truck.type];

                    return (
                        <div key={truck.type} className="bg-white p-3 shadow-md rounded-lg">
                            <div className="font-bold text-lg mb-4 text-center">{truck.type}</div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {grades.map((grade) => (
                                    <button
                                        key={grade}
                                        onClick={() => handleSelect(truck.type, grade)}
                                        className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border 
                                            ${
                                                selected === grade
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
