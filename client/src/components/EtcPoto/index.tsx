"use client";

import { useEffect, useRef } from "react";
import { useImageStore } from "@/store/imageStore";
import { EtcPotoProps } from "./EtcPoto.types";

export default function EtcPoto({ initialImages = [], setImages }: EtcPotoProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { previews, addPreview, removePreview, addFile, setPreviews, setOriginURLs, originURLs, files } =
        useImageStore();

    // 초기 이미지 설정
    useEffect(() => {
        if (initialImages.length > 0) {
            setPreviews(initialImages);
            setOriginURLs(initialImages);
        }
    }, [initialImages, setPreviews, setOriginURLs]);

    // ✅ 상위에 최종 이미지 목록 전달
    useEffect(() => {
        const fileReaders: Promise<string>[] = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(fileReaders).then((base64s) => {
            setImages?.([...originURLs, ...base64s]);
        });
    }, [originURLs, files, setImages]);

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
                addFile(file);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDelete = (idx: number) => {
        removePreview(idx);
    };

    return (
        <div className="w-full sm:p-20 p-0">
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
                        className="sm:w-[200px] sm:h-[200px] w-[130px] h-[130px] bg-[rgba(179,179,179,0.25)] flex justify-center items-center rounded-md shadow cursor-pointer"
                    >
                        <img
                            src="/images/addToPhoto.png"
                            alt="사진 추가"
                            className="sm:w-[60px] sm:h-[60px] w-[30px] h-[30px] opacity-70"
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-5 sm:gap-x-5 sm:gap-y-10 w-fit mx-auto">
                    {previews.map((src, idx) => (
                        <div
                            key={idx}
                            className="sm:w-[200px] sm:h-[200px] w-[130px] h-[130px]  cursor-pointer"
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
                        className="sm:w-[200px] sm:h-[200px] w-[130px] h-[130px] bg-[rgba(179,179,179,0.25)] flex justify-center items-center rounded-md shadow cursor-pointer"
                    >
                        <img
                            src="/images/addToPhoto.png"
                            alt="사진 추가"
                            className="sm:w-[60px] sm:h-[60px] w-[30px] h-[30px] opacity-70"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
