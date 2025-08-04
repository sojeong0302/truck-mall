"use client";

import { useRef, useState } from "react";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import ShortButton from "@/components/ShortButton";
import Filter from "@/components/Filter";
import { useFilterTagStore } from "@/components/Filter/Filter.types";
import SimpleFilter from "@/components/SimpleFilter";
import { useCarFormStore } from "@/store/carFormStore";
import { useImageStore } from "@/store/imageStore";
import axios from "axios";

export default function WritingUpload() {
    const { manufacturer, model, subModel, grade } = useFilterTagStore();
    const { files, clear } = useImageStore();
    const { thumbnail, name, fuel, type, trim, year, mileage, color, price, images, content, setField, clearForm } =
        useCarFormStore();

    const selectedTags = [manufacturer, model, subModel, grade].filter(Boolean);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setField("thumbnail", base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        // ✅ File 객체 → base64 배열로 변환
        const convertFilesToBase64 = async (files: File[]) => {
            const promises = files.map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });
            return Promise.all(promises);
        };

        try {
            const base64Images = await convertFilesToBase64(files);

            const formData = {
                simpleTags: selectedTags,
                tag: { manufacturer, model, subModel, grade },
                name,
                fuel,
                type,
                trim,
                year,
                mileage,
                color,
                price,
                thumbnail,
                images: base64Images, // ✅ base64 이미지 저장
                content,
            };

            const res = await axios.post("http://localhost:5000/sale/uploadSale", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            console.log("✅ 등록 성공:", res.data);
            alert("등록 되었습니다.");

            clearForm();
            clear();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error("❌ 등록 실패:", err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <SimpleFilter />
            <div className="w-[80%] h-[100%] mx-auto flex flex-col justify-center p-20 gap-7">
                <Filter />
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-lg font-semibold text-[#2E7D32] px-1">
                        {selectedTags.map((tag, idx) => (
                            <span key={idx} className="bg-[#2E7D32]/10 px-3 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="w-full flex justify-center gap-15">
                    <div
                        className="flex justify-center items-center cursor-pointer shadow-lg rounded-xl w-[50%] aspect-square min-w-[150px] bg-[rgba(179,179,179,0.25)] overflow-hidden"
                        onClick={handleClick}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {thumbnail ? (
                            <img src={thumbnail} alt="선택된 이미지" className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src="/images/addToPhoto.png"
                                alt="사진 추가"
                                className="w-[60px] h-[60px] opacity-70"
                            />
                        )}
                    </div>
                    <div className="flex flex-col justify-around">
                        <input
                            className="font-bold text-4xl border-b-2 border-[#575757] p-2"
                            value={name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="차량명을 입력해 주세요."
                        />
                        <div className="flex flex-col text-2xl p-2 gap-5">
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">연료:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={fuel}
                                    onChange={(e) => setField("fuel", e.target.value)}
                                    placeholder="연료를 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">차체 타입:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={type}
                                    onChange={(e) => setField("type", e.target.value)}
                                    placeholder="차체 타입을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">트림:</div>
                                <input
                                    value={trim}
                                    onChange={(e) => setField("trim", e.target.value)}
                                    placeholder="트림을 입력해 주세요."
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">연식:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={year}
                                    onChange={(e) => setField("year", e.target.value)}
                                    placeholder="연식을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">주행거리:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={mileage}
                                    onChange={(e) => setField("mileage", e.target.value)}
                                    placeholder="주행거리를 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">색상:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={color}
                                    onChange={(e) => setField("color", e.target.value)}
                                    placeholder="색상을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">가격:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={price}
                                    onChange={(e) => setField("price", e.target.value)}
                                    placeholder="가격을 입력해 주세요."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <EtcPoto />
                <TextArea value={content} setContent={(v) => setField("content", v)} />

                <div className="flex gap-3 justify-end">
                    <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                        등록하기
                    </ShortButton>
                    <ShortButton onClick={handleSubmit} className="bg-white border-3 border-[#2E7D32]">
                        취소
                    </ShortButton>
                </div>
            </div>
        </>
    );
}
