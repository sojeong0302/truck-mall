"use client";

import { useRef, useState, useEffect } from "react";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import ShortButton from "@/components/ShortButton";
import Filter from "@/components/Filter";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useFilterTagStore } from "@/components/Filter/Filter.types";
import SimpleFilter from "@/components/SimpleFilter";
import { useCarFormStore } from "@/store/carFormStore";
import { useImageStore } from "@/store/imageStore";
import { useSimpleTagStore } from "@/store/simpleTagStore";
import { useRouter } from "next/navigation";
import { SaleCrystalPagePropStore } from "../SaleCrystalPage/[id]/SaleCrystalPage.types";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api";

export default function WritingUpload() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;
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
    const clearFilter = useFilterTagStore((s) => s.clear);
    const resetSimpleTag = useSimpleTagStore((s) => s.resetSimpleTag);
    const clearImages = useImageStore((s) => s.clear);

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

    const token = useAuthStore((s) => s.token);

    // 등록 API 연동
    const handleSubmit = async () => {
        // 토큰 없으면 로그인 페이지 이동
        if (!token) {
            alert("로그인이 만료되었어요. \n다시 로그인해 주세요.");
            const here = window.location.pathname + window.location.search;
            router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            return;
        }

        //formData=서버로 보낼 데이터 묶음
        const formData = new FormData();
        formData.append("simple_tags", JSON.stringify(simpleTag || null));
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

        files.forEach((file) => {
            if (file instanceof File && file.name) {
                formData.append("images", file, file.name);
            }
        });

        formData.append("content", content);
        try {
            const { data } = await authApi.post(`${BASE_URL}/sale/uploadSale`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push(`/SaleDetailPage/${data.car.id}`);
        } catch (error) {}
    };

    // 변속기 선택지
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

    // 썸네일 삭제
    const handleClearThumbnail = () => {
        if (thumbnail?.startsWith("blob:")) {
            try {
                URL.revokeObjectURL(thumbnail);
            } catch {}
        }
        setThumbnail("");
        setThumbnailFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        router.back();
    };

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
                        className="mx-auto flex justify-center items-center cursor-pointer shadow-lg rounded-xl w-[70%] sm:w-[50%] aspect-square sm:min-w-[150px] bg-[rgba(179,179,179,0.25)] overflow-hidden"
                        onClick={!thumbnail ? handleClick : undefined}
                        onDoubleClick={thumbnail ? handleClearThumbnail : undefined}
                        title={thumbnail ? "더블클릭: 사진 삭제" : "클릭: 사진 선택"}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {thumbnail ? (
                            <img
                                src={thumbnail}
                                alt="선택된 이미지"
                                className="w-full h-full object-cover"
                                onDoubleClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClearThumbnail();
                                }}
                            />
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
                            {[
                                { label: "연료", value: fuel, setter: (v: string) => setField("fuel", v) },
                                { label: "차체 타입", value: type, setter: (v: string) => setField("type", v) },
                                { label: "트림", value: trim, setter: (v: string) => setField("trim", v) },
                                {
                                    label: "연식",
                                    value: year,
                                    setter: (v: string) => setField("year", v),
                                    type: "number",
                                },
                                { label: "주행거리", value: mileage, setter: (v: string) => setField("mileage", v) },
                                { label: "색상", value: color, setter: (v: string) => setField("color", v) },
                                {
                                    label: "가격",
                                    value: price,
                                    setter: (v: string) => setField("price", v),
                                    type: "number",
                                },
                            ].map((field, idx) => (
                                <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row" key={idx}>
                                    <div className="font-bold">{field.label}</div>
                                    <input
                                        type={field.type || "text"}
                                        className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                        value={field.value}
                                        onChange={(e) => field.setter(e.target.value)}
                                        placeholder={`${field.label}을 입력해 주세요.`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <EtcPoto />
                <TextArea value={content} setContent={(v) => setField("content", v)} />
                <div className="flex gap-3 justify-end">
                    <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                        등록하기
                    </ShortButton>
                    <ShortButton onClick={() => setIsModalOpen(true)} className="bg-white border-3 border-[#2E7D32]">
                        취소
                    </ShortButton>
                </div>
                {isModalOpen && (
                    <Modal
                        onConfirm={handleCancel}
                        text={"작성 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"}
                    />
                )}
            </div>
        </>
    );
}
