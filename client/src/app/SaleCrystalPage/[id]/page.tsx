"use client";

import { use, useEffect, useRef, useState } from "react";
import axios from "axios";
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

export default function SaleCrystalPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { id } = use(params);
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;
    const router = useRouter();
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
    } = store;

    const { files, originURLs } = useImageStore();
    const { simpleTag } = useSimpleTagStore();

    const thumbFileRef = useRef<File | null>(null);

    //기존 값 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/sale/${id}`);
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
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };

        fetchPost();
    }, [BASE_URL, id]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => fileInputRef.current?.click();
    const previewUrlRef = useRef<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

        thumbFileRef.current = f;
        const preview = URL.createObjectURL(f);
        previewUrlRef.current = preview;
        setThumbnail(preview);
    };

    //수정 api 연동
    const handleSubmit = async () => {
        //formData=서버로 보낼 데이터 묶음
        const formData = new FormData();

        if (simpleTag) {
            formData.append("simple_tags", JSON.stringify(simpleTag));
        } else {
            formData.append("simple_tags", "null");
        }

        if (thumbFileRef.current) {
            formData.append("thumbnail", thumbFileRef.current, thumbFileRef.current.name);
        }
        formData.append("name", name);
        formData.append("fuel", fuel);
        formData.append("type", type);
        formData.append("trim", trim);
        formData.append("year", year);
        formData.append("mileage", mileage);
        formData.append("color", color);
        formData.append("price", price);
        // 기존 이미지도 같이 보내기
        originURLs.forEach((url) => formData.append("originImages", url));

        // 새로 추가된 이미지
        files.forEach((file) => {
            formData.append("images", file, file.name); // ← filename 명시
        });
        formData.append("content", content);

        try {
            const res = await fetch(`${BASE_URL}/sale/${id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();
            console.log("응답:", data);
        } catch (error) {
            console.error("요청 실패:", error);
        }
    };

    return (
        <>
            <SimpleFilter />
            <Filter skipReset={true} />
            <div className="w-full flex justify-center flex-col items-center p-5 sm:p-15">
                <div className="w-[95%] sm:w-[80%] flex flex-col sm:gap-15 gap-5">
                    <div className="w-full flex-col flex justify-center gap-5 sm:gap-15">
                        <div
                            className="flex justify-center items-center cursor-pointer shadow-lg rounded-xl w-[]sm:w-[50%] aspect-square sm:min-w-[150px] bg-[rgba(179,179,179,0.25)] overflow-hidden"
                            onClick={handleImageClick}
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
                                onChange={(e) => setName(e.target.value)}
                                placeholder="차량명을 입력해 주세요."
                            />
                            <div className="flex flex-col text-xl sm:text-2xl p-2 gap-5">
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
                                            className="flex-1 shadow-md text-lg sm:text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            placeholder={`${field.label}을 입력해 주세요.`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <EtcPoto initialImages={sanitizedImages} setImages={setImages} />
                    <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
                    <div className="flex gap-3 justify-end">
                        <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                            수정하기
                        </ShortButton>
                        <ShortButton
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white border-3 border-[#2E7D32]"
                        >
                            취소
                        </ShortButton>
                    </div>
                </div>
                {isModalOpen && (
                    <Modal url="/CarSearchPage" text={"수정 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />
                )}
            </div>
        </>
    );
}
