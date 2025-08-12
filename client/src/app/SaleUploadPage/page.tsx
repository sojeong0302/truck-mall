"use client";

import { useRef, useState, useEffect } from "react";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import ShortButton from "@/components/ShortButton";
import Filter from "@/components/Filter";
import { useFilterTagStore } from "@/components/Filter/Filter.types";
import SimpleFilter from "@/components/SimpleFilter";
import { useCarFormStore } from "@/store/carFormStore";
import { useImageStore } from "@/store/imageStore";
import axios from "axios";
import { useSimpleTagStore } from "@/store/simpleTagStore";
import { useRouter } from "next/navigation";
import { SaleCrystalPagePropStore } from "../SaleCrystalPage/[id]/SaleCrystalPage.types";
import { getClientToken } from "@/utils/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function WritingUpload() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { simpleTag } = useSimpleTagStore();
    const { tags, setManufacturer, setModel, setSubModel, setGrade } = useFilterTagStore();
    const { files, originURLs } = useImageStore();

    const router = useRouter();
    const {
        transmission,
        thumbnail,
        thumbnailFile,
        name,
        fuel,
        type,
        trim,
        year,
        mileage,
        color,
        price,
        images,
        content,
        setField,
        setThumbnail,
        setThumbnailFile,
        clearForm,
    } = useCarFormStore();

    const resetForm = SaleCrystalPagePropStore((s) => s.reset);
    const clearFilter = useFilterTagStore((s) => s.clear); // tags 초기화
    const resetSimpleTag = useSimpleTagStore((s) => s.resetSimpleTag); // simple_tags 초기화
    const clearImages = useImageStore((s) => s.clear); // (옵션) 이미지 초기화

    useEffect(() => {
        resetForm();
        clearFilter();
        resetSimpleTag();
        clearImages();
        setSelected("");
    }, [resetForm, clearFilter, resetSimpleTag, clearImages]);

    const [selected, setSelected] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file);
        setThumbnail(URL.createObjectURL(file));
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const thumbFileRef = useRef<File | null>(null);

    const handleSubmit = async () => {
        //formData=서버로 보낼 데이터 묶음
        const formData = new FormData();

        formData.append("simple_tags", JSON.stringify(simpleTag || null));

        // 서버에서 원하는 계층형 구조로 전송
        formData.append("tags", JSON.stringify(tags));
        formData.append("transmission", transmission);

        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile, thumbnailFile.name);
        } else if (thumbnail && !thumbnail.startsWith("blob:") && !thumbnail.startsWith("data:")) {
            const blob = await fetch(thumbnail).then((r) => r.blob());
            formData.append("thumbnail", new File([blob], "thumbnail.jpg", { type: blob.type }));
        }

        formData.append("name", name);
        formData.append("fuel", fuel);
        formData.append("type", type);
        formData.append("trim", trim);
        formData.append("year", year);
        formData.append("mileage", mileage);
        formData.append("color", color);
        formData.append("price", price);

        // 새로 추가된 이미지
        files.forEach((file) => {
            if (file instanceof File && file.name) {
                formData.append("images", file, file.name);
            }
        });

        formData.append("content", content);

        const token = useAuthStore.getState().token;
        console.log("[upload] token ok? ", token ? `${token.slice(0, 12)}...${token.slice(-6)}` : token);
        if (!token) {
            alert("로그인이 필요합니다.");
            // router.push("/LoginPage");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/sale/uploadSale`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });

            // 👇 여기 추가
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                console.error("[upload] FAIL", res.status, text);
                alert(`업로드 실패 ${res.status}`);
                return;
            }

            // 성공 처리
            const data = await res.json();
            router.push(`/SaleDetailPage/${data.car.id}`);
        } catch (error) {}
    };

    //변속기 선택지
    const handleSelect = (item: string) => {
        setSelected(item);
        setIsOpen(false);
        if (item !== "전체") {
            setField("transmission", item);
        } else {
            setField("transmission", "");
        }
    };

    const selectedTags = [
        tags.manufacturer,
        tags.models?.[0]?.name,
        tags.models?.[0]?.subModels?.[0]?.name,
        tags.models?.[0]?.subModels?.[0]?.grades?.[0],
    ].filter(Boolean);

    return (
        <>
            <SimpleFilter skipReset={true} />
            <div className="w-[100%] sm:w-[80%] h-[100%] mx-auto flex flex-col justify-center p-5 sm:p-20 gap-7">
                <Filter skipReset={true} />
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-lg font-semibold text-[#2E7D32] px-1">
                        {selectedTags.map((tag, idx) => (
                            <span key={idx} className="bg-[#2E7D32]/10 px-3 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row w-full gap-0 sm:gap-10">
                    <div className="flex items-center gap-3">
                        <div className="text-sm sm:text-lg text-[#2E7D32]">▶</div>
                        <div className="text-lg sm:text-2xl font-medium">변속기</div>
                    </div>
                    <div className="relative w-48">
                        <button
                            className="transition transform duration-200 active:scale-95 cursor-pointer w-full text-left border border-[#2E7D32] rounded-md px-3 py-2 text-xl"
                            onClick={() => setIsOpen((prev) => !prev)}
                        >
                            {selected || "전체"}
                        </button>

                        {isOpen && (
                            <ul className="absolute z-10 bg-white border border-[#2E7D32] rounded-md w-full mt-1">
                                {["전체", "오토", "수동", "세미오토", "무단변속기"].map((item) => (
                                    <li
                                        key={item}
                                        className="px-3 py-2 hover:bg-[#2E7D32]/10 cursor-pointer"
                                        onClick={() => handleSelect(item)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col sm:flex-col justify-center gap-15">
                    <div
                        className="flex justify-center items-center cursor-pointer shadow-lg rounded-xl w-[]sm:w-[50%] aspect-square sm:min-w-[150px] bg-[rgba(179,179,179,0.25)] overflow-hidden"
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
                            className="font-bold text-2xl sm:text-4xl border-b-2 border-[#575757] p-2"
                            value={name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="차량명을 입력해 주세요."
                        />
                        <div className="flex flex-col text-xl sm:text-2xl p-2 gap-5">
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">연료</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={fuel}
                                    onChange={(e) => setField("fuel", e.target.value)}
                                    placeholder="연료를 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">차체 타입</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={type}
                                    onChange={(e) => setField("type", e.target.value)}
                                    placeholder="차체 타입을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">트림</div>
                                <input
                                    value={trim}
                                    onChange={(e) => setField("trim", e.target.value)}
                                    placeholder="트림을 입력해 주세요."
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                />
                            </div>
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">연식</div>
                                <input
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onKeyDown={(e) => {
                                        const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={year}
                                    type="number"
                                    onChange={(e) => setField("year", e.target.value)}
                                    placeholder="연식을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">주행거리</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={mileage}
                                    onChange={(e) => setField("mileage", e.target.value)}
                                    placeholder="주행거리를 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">색상</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={color}
                                    onChange={(e) => setField("color", e.target.value)}
                                    placeholder="색상을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                <div className="font-bold">가격</div>
                                <input
                                    onKeyDown={(e) => {
                                        // 허용할 키만 통과 (숫자, 백스페이스, 화살표 등)
                                        const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={price}
                                    type="number"
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
