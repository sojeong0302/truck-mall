"use client";

import { useEffect, useRef } from "react";
import { useImageStore } from "@/store/imageStore";

interface EtcPotoProps {
    initialImages?: string[];
}

export default function EtcPoto({ initialImages = [] }: EtcPotoProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { previews, addPreview, removePreview, setPreviews } = useImageStore();

    // 초기 이미지 설정 (post.images[])
    useEffect(() => {
        if (initialImages.length > 0) {
            setPreviews(initialImages);
        }
    }, [initialImages, setPreviews]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                addPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDelete = (idx: number) => {
        removePreview(idx);
    };

    return (
        <div className="w-full p-20">
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="image/*"
            />

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
                        <div
                            key={idx}
                            className="w-[200px] h-[200px] cursor-pointer"
                            onClick={() => handleDelete(idx)}
                            title="클릭하면 삭제됩니다"
                        >
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
