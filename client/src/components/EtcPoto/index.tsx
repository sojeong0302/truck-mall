"use client";
import { useState, useRef, useEffect } from "react";
import { EtcPotoProps } from "./EtcPoto.types";
import { useImageStore } from "@/store/imageStore";

export default function EtcPoto({ initialImages = [], onChange }: EtcPotoProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const { files, setFiles, setPreviews, setOriginURLs } = useImageStore();
    useEffect(() => {
        // 배열(문자열 배열)이 완전 동일하면 반영 생략
        const same =
            existingImages.length === initialImages.length && existingImages.every((v, i) => v === initialImages[i]);
        if (!same) setExistingImages(initialImages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialImages]); // existingImages는 의존성 제외 (의도적)

    // ✅ 부모 통지는 렌더 후에 한 번만 (경고 해결 포인트)
    useEffect(() => {
        onChange?.(newFiles, existingImages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newFiles, existingImages]); // onChange 제외

    // 파일 선택창 열기
    const handleClick = () => fileInputRef.current?.click();

    const handleDeleteExisting = (idx: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleDeleteNew = (idx: number) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    // 파일 추가

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const picked = Array.from(e.target.files);

        // store의 기존 files와 합침
        const updatedFiles = [...files, ...picked];
        setFiles(updatedFiles);
        setPreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
        setOriginURLs(existingImages); // 기존 URL 저장
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

            {existingImages.length + newFiles.length === 0 ? (
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
                    {existingImages.map((src, idx) => (
                        <div
                            key={`exist-${idx}`}
                            className="sm:w-[200px] sm:h-[200px] w-[130px] h-[130px] cursor-pointer"
                            onClick={() => handleDeleteExisting(idx)}
                        >
                            <img
                                src={src}
                                alt={`기존 이미지 ${idx + 1}`}
                                className="w-full h-full object-cover rounded-md shadow"
                            />
                        </div>
                    ))}
                    {newFiles.map((file, idx) => (
                        <div
                            key={`new-${idx}`}
                            className="sm:w-[200px] sm:h-[200px] w-[130px] h-[130px] cursor-pointer"
                            onClick={() => handleDeleteNew(idx)}
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`새 이미지 ${idx + 1}`}
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
