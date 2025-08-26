"use client";

import { useRef } from "react";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import ShortButton from "@/components/ShortButton";
import Filter from "@/components/Filter";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useFilterTagStore } from "@/components/Filter/Filter.hooks";
import SimpleFilter from "@/components/SimpleFilter";
import { useSaleFormStore } from "@/store/saleForm/saleForm.hooks";
import { useImageStore } from "@/store/imageStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api";
import PerformanceModal from "@/components/PerformanceModal";
import { openPerformanceModal } from "@/components/PerformanceModal/PerformanceModal.hooks";
import { usePerformanceModal } from "@/components/PerformanceModal/PerformanceModal.hooks";

export default function WritingUpload() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;
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

    const { files } = useImageStore();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 썸네일 클릭 (파일 탐색기 오픈)
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // 썸네일 선택
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file);
        setThumbnail(URL.createObjectURL(file));
    };

    const token = useAuthStore((s) => s.token);

    // 등록 시도
    const handleSubmit = async () => {
        // 토큰 없으면 로그인 페이지 이동
        if (!token) {
            alert("로그인이 만료되었어요. \n다시 로그인해 주세요.");
            const here = window.location.pathname + window.location.search;
            router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            return;
        }

        // formData = 서버로 보낼 데이터 묶음
        const formData = new FormData();
        formData.append("simple_tags", JSON.stringify(simple_tags ?? []));
        formData.append("normal_tags", JSON.stringify(normal_tags ?? {}));
        formData.append("transmission", transmission ?? "");

        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile, thumbnailFile.name);
        } else if (thumbnail && !thumbnail.startsWith("blob:") && !thumbnail.startsWith("data:")) {
            const blob = await fetch(thumbnail).then((r) => r.blob());
            formData.append("thumbnail", new File([blob], "thumbnail.jpg", { type: blob.type }));
        }

        formData.append("name", name ?? "");
        formData.append("fuel", fuel ?? "");
        formData.append("year", year ?? "");
        formData.append("mileage", mileage ?? "");
        formData.append("color", color ?? "");
        formData.append("price", price ?? "");
        formData.append("simple_content", simple_content ?? "");
        formData.append("vin", vin ?? "");
        formData.append("performance_number", performance_number ?? "");
        formData.append("suggest_number", suggest_number ?? "");
        formData.append("car_number", car_number ?? "");

        files.forEach((file) => {
            if (file instanceof File && file.name) {
                formData.append("images", file, file.name);
            }
        });

        // ✅ 성능점검 PDF를 같은 요청에 포함
        if (pdfFile) {
            formData.append("performance_pdf", pdfFile, pdfFile.name);
        }

        formData.append("content", content ?? "");

        // 디버그 로그
        for (const [key, value] of formData.entries()) {
            console.log("formData key:", key, value);
        }

        // api 연동 (한 번의 요청으로 끝)
        try {
            const { data } = await authApi.post(`${BASE_URL}/sale/uploadSale`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ 성공 후 모달 상태 초기화 & 페이지 이동
            resetPerfModal();
            router.push(`/SaleDetailPage/${data.sale.id}`);
            console.log(data.data);
        } catch (error) {
            console.error("업로드 중 에러 발생:", error);
        }
    };

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

    return (
        <>
            <SimpleFilter skipReset={true} />
            <div className="w-[100%] sm:w-[80%] h-[100%] mx-auto flex flex-col justify-center p-5 sm:p-20 gap-7">
                <Filter skipReset={true} />
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-lg font-semibold text-[#2E7D32] px-1">
                        {selectedTags.flat().map((tag, idx) => (
                            <span key={`${tag}-${idx}`} className="bg-[#2E7D32]/10 px-3 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="w-full flex flex-col sm:flex-col justify-center gap-15">
                    {/* 썸네일 */}
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
                    {/* 상세란 */}
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
                                    label: "제시 번호",
                                    value: suggest_number,
                                    setter: (v: string) => setField("suggest_number", v),
                                },
                                {
                                    label: "성능 번호",
                                    value: performance_number,
                                    setter: (v: string) => setField("performance_number", v),
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
                <PerformanceModal />
            </div>
        </>
    );
}
