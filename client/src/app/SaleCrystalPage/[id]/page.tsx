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
import { useSimpleTagStore } from "@/store/simpleTag/simpleTag.hooks";
import { useSaleFormStore } from "@/store/saleForm/saleForm.hooks";
import { useAuthStore } from "@/store/useAuthStore";
import { api, authApi } from "@/lib/api";
import { useFilterTagStore } from "@/components/Filter/Filter.hooks";
import PerformanceModal from "@/components/PerformanceModal";
import { openPerformanceModal } from "@/components/PerformanceModal/PerformanceModal.hooks";
import { usePerformanceModal } from "@/components/PerformanceModal/PerformanceModal.hooks";

export default function SaleCrystalPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;
    const { id } = use(params);
    const router = useRouter();
    const {
        thumbnail,
        thumbnailFile,
        name,
        fuel,
        year,
        mileage,
        color,
        price,
        car_number,
        vin,
        performance_number,
        suggest_number,
        transmission,
        content,
        simple_tags,
        setField,
        setThumbnail,
        setThumbnailFile,
        clearForm,
        simple_content,
        setManufacturer,
        setModel,
        setSubModel,
        setGrade,
    } = useSaleFormStore();

    const { draft } = useFilterTagStore();

    const rawGrades = draft.models[0]?.subModels[0]?.grades as string | string[];
    const grades = typeof rawGrades === "string" ? rawGrades.split("/") : Array.isArray(rawGrades) ? rawGrades : [];
    const { pdfFile, reset: resetPerfModal } = usePerformanceModal();
    const normal_tags = {
        manufacturer: draft.manufacturer,
        models: [
            {
                name: draft.models?.[0]?.name || "",
                subModels: [
                    {
                        name: draft.models?.[0]?.subModels?.[0]?.name || "",
                        grades: grades,
                    },
                ],
            },
        ],
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file);
        setThumbnail(URL.createObjectURL(file));
    };

    const token = useAuthStore((s) => s.token);

    //기존 값 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`${BASE_URL}/sale/${id}`);
                const data = res.data;

                // ✅ 썸네일
                const t = data.thumbnail;
                const absThumb = t && !t.startsWith("blob:") ? (t.startsWith("http") ? t : `${BASE_URL}${t}`) : "";
                setThumbnail(absThumb);
                // 기존 썸네일이 있으면 keep으로 시작
                setThumbnailState(absThumb ? "keep" : "remove");

                // ✅ 이미지 (화면 표기용 & 서버 유지용 각각 세팅)
                const rawImgs: string[] = Array.isArray(data.images) ? data.images : [];
                // 화면용(절대경로)
                const absImgs = rawImgs
                    .filter((u) => typeof u === "string" && !u.startsWith("blob:"))
                    .map((u) => (u.startsWith("http") ? u : `${BASE_URL}${u}`));
                setSanitizedImages(absImgs);
                // 서버 유지용(있는 그대로) —> 수정 안 해도 유지되도록
                setPrevImages(rawImgs);

                // ✅ 폼 기본/숫자 필드 (숫자는 문자열로 넣어두면 input=number에서도 안전)
                setField("name", data.name ?? "");
                setField("fuel", data.fuel ?? "");
                setField("year", data.year != null ? String(data.year) : "");
                setField("mileage", data.mileage != null ? String(data.mileage) : "");
                setField("color", data.color ?? "");
                setField("price", data.price != null ? String(data.price) : "");
                setField("simple_content", data.simple_content ?? "");
                setField("vin", data.vin ?? "");
                setField("performance_number", data.performance_number ?? "");
                setField("suggest_number", data.suggest_number ?? "");
                setField("car_number", data.car_number ?? "");
                setField("content", data.content ?? "");
                setField("transmission", data.transmission ?? "");

                // ✅ simple_tags
                if (data.simple_tags && typeof data.simple_tags === "object") {
                    if ("type" in data.simple_tags && "grade" in data.simple_tags) {
                        setSimpleTag((data.simple_tags as any).type, (data.simple_tags as any).grade, true);
                    }
                }

                // ✅ 계층형 태그 (서버 to_dict가 tags/normal_tags 어떤 키를 주든 대비)
                const rawTags = data.normal_tags ?? data.tags ?? null;

                // 문자열로 오는 경우도 대비
                const parsed =
                    typeof rawTags === "string"
                        ? (() => {
                              try {
                                  return JSON.parse(rawTags);
                              } catch {
                                  return null;
                              }
                          })()
                        : rawTags;

                let manufacturer = "";
                let model = "";
                let subModel = "";
                let gradesArr: string[] = [];

                if (parsed && typeof parsed === "object") {
                    manufacturer = parsed.manufacturer || "";
                    model = parsed.models?.[0]?.name || "";
                    subModel = parsed.models?.[0]?.subModels?.[0]?.name || "";
                    const g = parsed.models?.[0]?.subModels?.[0]?.grades;
                    gradesArr = Array.isArray(g) ? g : typeof g === "string" ? g.split("/") : [];
                } else {
                    // 🔁 fallback: 서버가 평탄화해둔 필드만 줄 때
                    manufacturer = data.manufacturer || "";
                    model = data.model || "";
                    subModel = data.sub_model || "";
                    gradesArr = data.grade ? [data.grade] : [];
                }
                setManufacturer(manufacturer);
                setModel(model);
                setSubModel(subModel);
                setGrade(gradesArr);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };
        fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BASE_URL, id]);

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

    // 취소 모달 -> '네' 클릭
    const handleCancel = () => {
        router.back();
    };

    // 사용자가 선택한 Filter를 보여지게 하기 위한 용도
    const selectedTags = [
        draft.manufacturer,
        draft.models[0]?.name,
        draft.models[0]?.subModels[0]?.name,
        ...grades,
    ].filter(Boolean);

    const [prevImages, setPrevImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [sanitizedImages, setSanitizedImages] = useState<string[]>([]);

    const { simpleTag, setSimpleTag } = useSimpleTagStore();
    const thumbFileRef = useRef<File | null>(null);

    const handleImageClick = () => fileInputRef.current?.click();
    const previewUrlRef = useRef<string | null>(null);
    const [thumbnailState, setThumbnailState] = useState<"keep" | "new" | "remove">("keep");

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

    // 수정 시도
    const handleSubmit = async () => {
        // 토큰 없으면 로그인 페이지 이동
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
        formData.append("normal_tags", JSON.stringify(normal_tags || {}));
        formData.append("transmission", transmission || "");
        formData.append("thumbnail_state", thumbStateToSend);

        // 새 썸네일 업로드 시
        if (thumbStateToSend === "new" && thumbFileRef.current) {
            formData.append("thumbnail", thumbFileRef.current, thumbFileRef.current.name);
        }

        // 기본 필드
        formData.append("name", name);
        formData.append("fuel", fuel);
        formData.append("year", year);
        formData.append("mileage", mileage);
        formData.append("color", color);
        formData.append("price", price);
        formData.append("simple_content", simple_content);
        formData.append("vin", vin);
        formData.append("performance_number", performance_number);
        formData.append("suggest_number", suggest_number);
        formData.append("car_number", car_number);
        formData.append("content", content);

        if (pdfFile) {
            formData.append("performance_pdf", pdfFile, pdfFile.name);
        }

        // 기존 이미지(유지)
        prevImages.forEach((url) => formData.append("originImages", url));

        // 새 이미지(추가)
        newImages.forEach((file) => formData.append("images", file, file.name));

        // api 연동
        try {
            await authApi.put(`${BASE_URL}/sale/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("수정되었습니다.");
            resetPerfModal();
            router.push(`/SaleDetailPage/${id}`);
        } catch (error) {
            console.error("수정 실패", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };
    const clearAll = useFilterTagStore((s) => s.clearAll);
    // 페이지 떠날 때(언마운트) 초기화
    useEffect(() => {
        return () => {
            setSimpleTag("", "", true);
            clearAll();
        };
    }, [setSimpleTag, clearAll]);

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

                <div className="w-full flex flex-col sm:flex-col justify-center gap-15 ">
                    <div
                        className="mx-auto flex justify-center items-center cursor-pointer shadow-lg rounded-xl w-[70%] sm:w-[50%] aspect-square sm:min-w-[150px] bg-[rgba(179,179,179,0.25)] overflow-hidden"
                        onClick={!thumbnail ? handleImageClick : undefined}
                        onDoubleClick={thumbnail ? handleClearThumbnail : undefined}
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
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="차량명을 입력해 주세요."
                        />
                        <div className="flex flex-col text-xl sm:text-2xl p-2 gap-10">
                            {[
                                {
                                    label: "연식",
                                    value: year,
                                    setter: (v: string) => setField("year", v),
                                    type: "number",
                                },
                                { label: "연료", value: fuel, setter: (v: string) => setField("fuel", v) },
                                {
                                    label: "변속기",
                                    value: transmission,
                                    setter: (v: string) => setField("transmission", v),
                                    customType: "select",
                                    options: ["오토", "수동", "세미오토", "무단변속기"],
                                },
                                { label: "색상", value: color, setter: (v: string) => setField("color", v) },
                                {
                                    label: "주행거리",
                                    value: mileage,
                                    setter: (v: string) => setField("mileage", v),
                                    type: "number",
                                },
                                { label: "차대 번호", value: vin, setter: (v: string) => setField("vin", v) },
                                {
                                    label: "간단 내용",
                                    value: simple_content,
                                    setter: (v: string) => setField("simple_content", v),
                                },
                                {
                                    label: "차량 번호",
                                    value: car_number,
                                    setter: (v: string) => setField("car_number", v),
                                },
                                {
                                    label: "성능 번호",
                                    value: performance_number,
                                    setter: (v: string) => setField("performance_number", v),
                                },
                                {
                                    label: "제시 번호",
                                    value: suggest_number,
                                    setter: (v: string) => setField("suggest_number", v),
                                },
                                {
                                    label: "가격",
                                    value: price,
                                    setter: (v: string) => setField("price", v),
                                    type: "number",
                                },
                            ].map((field, idx) => (
                                <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row" key={idx}>
                                    <div className="font-bold">{field.label}</div>
                                    {field.customType === "select" ? (
                                        <select
                                            className={`flex-1 shadow-md text-2xl border-2 border-[#2E7D32] rounded-xl p-3.5
                                ${!field.value ? "text-gray-500" : "text-black"}`}
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                        >
                                            <option value="" disabled hidden>
                                                선택해 주세요
                                            </option>
                                            {field.options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type || "text"}
                                            className="flex-1 shadow-md text-2xl border-2 border-[#2E7D32] rounded-xl p-3"
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            placeholder={`${field.label}을 입력해 주세요.`}
                                        />
                                    )}
                                    {field.label === "성능 번호" && (
                                        <div className="relative group inline-flex">
                                            <ShortButton
                                                onClick={() => openPerformanceModal()}
                                                className="whitespace-nowrap bg-white border-2 border-[#2E7D32] text-[#2E7D32]"
                                            >
                                                성능점검표
                                            </ShortButton>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <EtcPoto initialImages={initialImageUrls} onChange={handleImagesChange} />
                <TextArea value={content} onChange={(e) => setField("content", e.target.value)} />
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
                <PerformanceModal />
            </div>
        </>
    );
}
