"use client";

import { use, useEffect, useRef, useState, useMemo, useCallback } from "react";
import ShortButton from "@/components/ShortButton";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { SaleCrystalPagePropStore } from "./SaleCrystalPage.types";
import { useRouter } from "next/navigation";
import SimpleFilter from "@/components/SimpleFilter";
import Filter from "@/components/Filter";
import { useImageStore } from "@/store/imageStore";
import { useSimpleTagStore } from "@/store/simpleTagStore";
import { useFilterTagStore } from "@/components/Filter/Filter.types";
import { useAuthStore } from "@/store/useAuthStore";
import { api, authApi } from "@/lib/api";

export default function SaleCrystalPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { id } = use(params);
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;
    const router = useRouter();
    const [prevImages, setPrevImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);

    const store = SaleCrystalPagePropStore();
    const [sanitizedImages, setSanitizedImages] = useState<string[]>([]);
    const {
        thumbnail,
        setThumbnail,
        name,
        setName,
        fuel,
        setFuel,
        type,
        setType,
        trim,
        setTrim,
        year,
        setYear,
        mileage,
        setMileage,
        color,
        setColor,
        price,
        setPrice,
        content,
        setContent,
        setImages,
        transmission,
        setTransmission,
    } = store;

    const { files, originURLs } = useImageStore();
    const { simpleTag, setSimpleTag } = useSimpleTagStore();
    const { tags, setManufacturer, setModel, setSubModel, setGrade } = useFilterTagStore();
    const [isOpen, setIsOpen] = useState(false);
    const thumbFileRef = useRef<File | null>(null);
    const token = useAuthStore((s) => s.token);

    //기존 값 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`${BASE_URL}/sale/${id}`);
                const data = res.data;

                // 썸네일 처리
                const t = data.thumbnail;
                setThumbnail(t && !t.startsWith("blob:") ? `${BASE_URL}${t}` : "");

                // 이미지 배열 처리
                const imgs = (data.images ?? [])
                    .filter((u: string) => typeof u === "string" && !u.startsWith("blob:"))
                    .map((u: string) => (u.startsWith("http") ? u : `${BASE_URL}${u}`));
                setSanitizedImages(imgs);

                // 나머지 필드
                setName(data.name ?? "");
                setFuel(data.fuel ?? "");
                setType(data.type ?? "");
                setTrim(data.trim ?? "");
                setYear(data.year?.toString() ?? "");
                setMileage(data.mileage ?? "");
                setColor(data.color ?? "");
                setPrice(data.price?.toString() ?? "");
                setContent(data.content ?? "");
                setTransmission(data.transmission ?? "");
                if (data.simple_tags) {
                    let type, grade;

                    // 객체 형태로 올 때 (중첩 구조 방지)
                    if (data.simple_tags.type && typeof data.simple_tags.type === "object") {
                        type = data.simple_tags.type.type;
                        grade = data.simple_tags.type.grade;
                    }
                    // 올바른 객체 형태일 때
                    else if (data.simple_tags.type && data.simple_tags.grade) {
                        type = data.simple_tags.type;
                        grade = data.simple_tags.grade;
                    }
                    // 배열 형태일 때
                    else if (Array.isArray(data.simple_tags) && data.simple_tags.length === 2) {
                        [type, grade] = data.simple_tags;
                    }

                    if (type && grade) {
                        setSimpleTag(type, grade, true);
                    }

                    if (data.tags) {
                        setManufacturer(data.tags.manufacturer || "", true);
                        if (data.tags.models?.[0]) {
                            setModel(data.tags.models[0].name || "", true);
                            if (data.tags.models[0].subModels?.[0]) {
                                setSubModel(data.tags.models[0].subModels[0].name || "", true);
                                if (data.tags.models[0].subModels[0].grades?.[0]) {
                                    setGrade(data.tags.models[0].subModels[0].grades[0] || "", true);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };

        fetchPost();
    }, [BASE_URL, id]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => fileInputRef.current?.click();

    const previewUrlRef = useRef<string | null>(null);

    const [thumbnailState, setThumbnailState] = useState<"keep" | "new" | "remove">("keep");

    //변속기 선택지
    const handleSelect = (item: string) => {
        setIsOpen(false);
        setTransmission(item !== "전체" ? item : "");
    };

    // 기존 이미지 URL 변환
    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url}`;
    };

    const initialImageUrls = useMemo(() => {
        return sanitizedImages.map((img) => getImageUrl(img));
    }, [sanitizedImages, BASE_URL]);

    const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

        thumbFileRef.current = f;
        const preview = URL.createObjectURL(f);
        previewUrlRef.current = preview;
        setThumbnail(preview);
        setThumbnailState("new");
    };

    const handleImagesChange = useCallback((files: File[], keepImages: string[]) => {
        setNewImages(files);
        setPrevImages(keepImages);
    }, []);

    const handleCancel = () => {
        router.back();
    };

    // 썸네일 삭제
    const handleDeleteThumbnail = () => {
        setThumbnailState("remove");
        setThumbnail("");
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        thumbFileRef.current = null;
    };

    const selectedTags = [
        tags.manufacturer,
        tags.models?.[0]?.name,
        tags.models?.[0]?.subModels?.[0]?.name,
        tags.models?.[0]?.subModels?.[0]?.grades?.[0],
    ].filter(Boolean);

    const handleSubmit = async () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            const here = window.location.pathname + window.location.search;
            requestAnimationFrame(() => {
                router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            });
            return;
        }

        // 썸네일 상태 결정
        let thumbStateToSend: "keep" | "new" | "remove" = thumbnailState;
        if (!thumbnail && thumbnailState !== "new") {
            thumbStateToSend = "remove";
        }

        const formData = new FormData();
        formData.append("simple_tags", JSON.stringify(simpleTag || null));
        formData.append("tags", JSON.stringify(tags || {}));
        formData.append("transmission", transmission || "");
        formData.append("thumbnail_state", thumbStateToSend);

        // 새 썸네일 업로드 시
        if (thumbStateToSend === "new" && thumbFileRef.current) {
            formData.append("thumbnail", thumbFileRef.current, thumbFileRef.current.name);
        }

        // 기본 필드
        formData.append("name", name);
        formData.append("fuel", fuel);
        formData.append("type", type);
        formData.append("trim", trim);
        formData.append("year", year);
        formData.append("mileage", mileage);
        formData.append("color", color);
        formData.append("price", price);
        formData.append("content", content);

        // 기존 이미지(유지)
        prevImages.forEach((url) => formData.append("originImages", url));
        // 새 이미지(추가)
        newImages.forEach((file) => formData.append("images", file, file.name));

        try {
            await authApi.put(`${BASE_URL}/sale/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("수정되었습니다.");
            router.push(`/SaleDetailPage/${id}`); // 수정 후 상세페이지로 이동 (원하면 변경 가능)
        } catch (error) {
            console.error("수정 실패", error);
            alert("수정 중 오류가 발생했습니다.");
        }
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
                            {transmission || "전체"}
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
                <div className="w-full flex flex-col sm:flex-col justify-center gap-15 ">
                    <div
                        className="mx-auto flex justify-center items-center cursor-pointer shadow-lg rounded-xl w-[70%] sm:w-[50%] aspect-square sm:min-w-[150px] bg-[rgba(179,179,179,0.25)] overflow-hidden"
                        onClick={!thumbnail ? handleImageClick : undefined}
                        onDoubleClick={thumbnail ? handleDeleteThumbnail : undefined}
                        title={thumbnail ? "더블클릭: 썸네일 삭제" : "클릭: 썸네일 선택"}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleThumbChange}
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
                            className="focus:outline-none font-bold text-2xl sm:text-4xl border-b-2 border-[#575757] p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="차량명을 입력해 주세요."
                        />
                        <div className="flex flex-col text-xl sm:text-2xl p-2 gap-10">
                            {[
                                { label: "연료", value: fuel, setter: setFuel },
                                { label: "차체 타입", value: type, setter: setType },
                                { label: "트림", value: trim, setter: setTrim },
                                { label: "연식", value: year, setter: setYear, type: "number" },
                                { label: "주행거리", value: mileage, setter: setMileage },
                                { label: "색상", value: color, setter: setColor },
                                { label: "가격", value: price, setter: setPrice, type: "number" },
                            ].map((field, idx) => (
                                <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row" key={idx}>
                                    <div className="font-bold">{field.label}</div>
                                    <input
                                        type={field.type || "text"}
                                        className="flex-1 shadow-md text-lg sm:text-2xl border-2 border-[#2E7D32] rounded-xl p-3"
                                        value={field.value}
                                        onChange={(e) => field.setter(e.target.value)}
                                        placeholder={`${field.label}을 입력해 주세요.`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <EtcPoto initialImages={initialImageUrls} onChange={handleImagesChange} />
                <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
                <div className="flex gap-3 justify-end">
                    <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                        수정하기
                    </ShortButton>
                    <ShortButton onClick={() => setIsModalOpen(true)} className="bg-white border-3 border-[#2E7D32]">
                        취소
                    </ShortButton>
                </div>
                {isModalOpen && (
                    <Modal
                        onConfirm={handleCancel}
                        text={"수정 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"}
                    />
                )}
            </div>
        </>
    );
}
