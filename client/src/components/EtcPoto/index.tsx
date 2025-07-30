"use client";

import { useRef, useState } from "react";

export default function EtcPoto() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // ✅ 여기서 반드시 동작
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full">
            {/* ✅ input은 항상 렌더링 */}
            <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" accept="image/*" />

            {previews.length === 0 ? (
                <div className="flex justify-center">
                    <div
                        onClick={handleClick}
                        className="w-[200px] h-[200px] bg-[rgba(179,179,179,0.25)] flex justify-center items-center rounded-md shadow cursor-pointer"
                    >
                        <img src="/images/addToPhoto.png" alt="사진 추가" className="w-[60px] h-[60px] opacity-70" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10 w-fit mx-auto">
                    {previews.map((src, idx) => (
                        <div key={idx} className="w-[200px] h-[200px]">
                            <img
                                src={src}
                                alt={`미리보기 ${idx + 1}`}
                                className="w-full h-full object-cover rounded-md shadow"
                            />
                        </div>
                    ))}

                    <div
                        onClick={handleClick}
                        className="w-[200px] h-[200px] bg-[rgba(179,179,179,0.25)] flex justify-center items-center rounded-md shadow cursor-pointer"
                    >
                        <img src="/images/addToPhoto.png" alt="사진 추가" className="w-[60px] h-[60px] opacity-70" />
                    </div>
                </div>
            )}
        </div>
    );
}
