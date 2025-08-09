"use client";

import { use, useEffect, useRef, useState } from "react";
import axios from "axios";
import ShortButton from "@/components/ShortButton";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import Modal from "@/components/Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { SaleProps } from "@/components/Sale/Sale.types";
import { SaleCrystalPagePropStore } from "./SaleCrystalPage.types";
import { useRouter } from "next/navigation";
import SimpleFilter from "@/components/SimpleFilter";
import Filter from "@/components/Filter";

export default function SaleCrystalPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const { id } = use(params);
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;
    const router = useRouter();
    const store = SaleCrystalPagePropStore();

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
    } = store;

    // ✅ 썸네일 실제 파일을 보관할 ref
    const thumbFileRef = useRef<File | null>(null);

    // ✅ EtcPoto가 File[]를 넘겨줄 수 있다면 이렇게 받는 걸 추천
    // (지금은 string[]을 쓰고 있어서 fallback도 아래에 제공)
    const [files, setFiles] = useState<File[]>([]);

    // 서버에서 기존 데이터 불러오기
    const [post, setPost] = useState<SaleProps | null>(null);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/sale/${id}`);
                setPost(res.data);
            } catch (error) {}
        };
        fetchPost();
    }, [BASE_URL, id]);

    useEffect(() => {
        if (!post) return;
        setThumbnail(post.thumbnail ?? "");
        setName(post.name ?? "");
        setFuel(post.fuel ?? "");
        setType(post.type ?? "");
        setTrim(post.trim ?? "");
        setYear(post.year?.toString() ?? "");
        setMileage(post.mileage ?? "");
        setColor(post.color ?? "");
        setPrice(post.price?.toString() ?? "");
        setContent(post.content ?? "");
    }, [post, setThumbnail, setName, setFuel, setType, setTrim, setYear, setMileage, setColor, setPrice, setContent]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => fileInputRef.current?.click();

    // ✅ 썸네일 선택: 미리보기는 blob URL, 실제 전송은 File로
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;
        thumbFileRef.current = f; // 파일 저장
        const preview = URL.createObjectURL(f);
        setThumbnail(preview); // 미리보기
    };

    // ❗ (선택) base64 → Blob 변환 도우미 (EtcPoto가 string[]를 줄 때만 사용)
    const dataUrlToBlob = (dataUrl: string) => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    };

    // ✅ 제출: FormData로 전송 (절대 JSON으로 blob URL을 보내지 말 것)
    const handleSubmit = async () => {
        if (!post) return;

        const form = new FormData();

        // 텍스트/숫자 필드
        form.append("name", name);
        form.append("fuel", fuel);
        form.append("type", type);
        form.append("trim", trim);
        form.append("year", year); // 숫자면 String(...)으로 명확화 가능
        form.append("mileage", mileage);
        form.append("color", color);
        form.append("price", price);
        form.append("content", content);

        // 태그는 JSON 문자열로
        form.append(
            "tag",
            JSON.stringify({
                manufacturer: (post as any).manufacturer ?? "",
                model: (post as any).model ?? "",
                subModel: (post as any).sub_model ?? "",
                grade: (post as any).grade ?? "",
            })
        );

        // 썸네일: 새 파일을 고른 경우만 파일로 첨부. 아니면 기존 URL을 전달
        if (thumbFileRef.current) {
            form.append("thumbnail", thumbFileRef.current, thumbFileRef.current.name);
        } else if (post.thumbnail) {
            form.append("thumbnail_url", post.thumbnail);
        }

        // 추가 이미지: File[]가 있다면 그대로 첨부
        if (files.length > 0) {
            files.forEach((f) => form.append("images", f, f.name));
        } else {
            // (Fallback) images가 base64 string[]인 경우 Blob으로 변환해서 첨부
            // 기존 코드에서 setImages가 string[]를 주고 있다면 이 부분을 사용
            // 주의: base64는 용량이 커지니 가능하면 EtcPoto를 File[]로 바꾸는 게 훨씬 좋음
            // example: base64Images.forEach((s, i)=>form.append("images", new File([dataUrlToBlob(s)], `img_${i}.jpg`)))
        }

        await axios.put(`${BASE_URL}/sale/${id}`, form, {
            withCredentials: true, // 필요 시
            // ⚠️ Content-Type 설정하지 마세요 (axios가 multipart boundary 자동 설정)
        });

        alert("수정되었습니다.");
        router.push("/");
    };

    if (!post) {
        return <div className="p-10 text-red-600">해당 매물을 찾을 수 없습니다.</div>;
    }

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
                                    { label: "연식", value: year, setter: setYear },
                                    { label: "주행거리", value: mileage, setter: setMileage },
                                    { label: "색상", value: color, setter: setColor },
                                    { label: "가격", value: price, setter: setPrice },
                                ].map((field, idx) => (
                                    <div className="flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row" key={idx}>
                                        <div className="font-bold">{field.label}</div>
                                        <input
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

                    {/* ✅ EtcPoto가 File[]를 줄 수 있게 구현했다면 이렇게: */}
                    {/* <EtcPoto initialFiles={[]} onChangeFiles={(fs: File[]) => setFiles(fs)} /> */}

                    {/* 기존처럼 string[]을 주는 경우라면 변환해서 위에서 append 하는 방식 사용 */}
                    <EtcPoto
                        initialImages={post.images ?? []}
                        setImages={
                            // 만약 setImages가 string[]을 넘겨주면 여기서 File로 변환도 가능
                            // (성능/메모리 생각하면 권장 X. 가급적 EtcPoto를 File[]로 바꿔주세요)
                            // (arr) => { setFiles(arr.map((s, i) => new File([dataUrlToBlob(s)], `img_${i}.jpg`))); }
                            undefined as any
                        }
                    />

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
