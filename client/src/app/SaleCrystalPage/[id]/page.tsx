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

export default function SaleCrystalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // ✅ use로 언랩

    // ✅ Zustand 훅들 최상단에서 호출
    const modalStore = useModalStore();
    const { isModalOpen, setIsModalOpen } = modalStore;

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

    // ✅ 게시글 데이터 가져오기
    const [post, setPost] = useState<SaleProps | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/sale/${id}`);
                setPost(res.data);
            } catch (error) {
                console.error("데이터 불러오기 실패", error);
            }
        };
        fetchPost();
    }, [id]);

    // ✅ Zustand store에 초기값 넣기 (post 값이 바뀔 때마다)
    useEffect(() => {
        if (!post) return;
        setThumbnail(post.thumbnail ?? "");
        setName(post.name ?? "");
        setFuel(post.fuel ?? "");
        setType(post.type ?? "");
        setTrim(post.trim ?? "");
        setYear(post.year ?? "");
        setMileage(post.mileage ?? "");
        setColor(post.color ?? "");
        setPrice(post.price ?? "");
        setContent(post.content ?? "");
    }, [post]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setThumbnail(imageUrl);
        }
    };

    const handleSubmit = () => {
        alert("수정 되었습니다.");
        // TODO: 서버에 수정사항 저장하는 API 호출 필요
    };

    // ✅ 로딩 대체 UI
    if (!post) {
        return <div className="p-10 text-red-600">해당 매물을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="w-full flex justify-center flex-col items-center p-15">
            <div className="w-[80%] flex flex-col gap-15">
                <div className="w-full flex justify-center gap-15">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt="썸네일"
                            className="border-1 shadow-lg rounded-xl w-[50%] h-[600px] min-w-[150px] object-contain"
                            onClick={handleImageClick}
                        />
                    ) : (
                        <div
                            onClick={handleImageClick}
                            className="flex justify-center items-center w-[50%] h-[300px] min-w-[150px] bg-gray-100 rounded-xl text-gray-500 cursor-pointer"
                        >
                            이미지 준비중입니다.
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <div className="flex flex-col justify-around">
                        <input
                            className="font-bold text-4xl border-b-2 border-[#575757] p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="차량명을 입력해 주세요."
                        />
                        <div className="flex flex-col text-2xl p-2 gap-5">
                            {[
                                { label: "연료", value: fuel, setter: setFuel },
                                { label: "차체 타입", value: type, setter: setType },
                                { label: "트림", value: trim, setter: setTrim },
                                { label: "연식", value: year, setter: setYear },
                                { label: "주행거리", value: mileage, setter: setMileage },
                                { label: "색상", value: color, setter: setColor },
                                { label: "가격", value: price, setter: setPrice },
                            ].map((field, idx) => (
                                <div className="flex gap-3 items-center" key={idx}>
                                    <div className="font-bold">{field.label}:</div>
                                    <input
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

                <EtcPoto initialImages={post.images} />
                <TextArea value={content} onChange={(e) => setContent(e.target.value)} />

                <div className="flex gap-3 justify-end">
                    <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                        수정하기
                    </ShortButton>
                    <ShortButton onClick={handleSubmit} className="bg-white border-3 border-[#2E7D32]">
                        취소
                    </ShortButton>
                </div>
            </div>

            {isModalOpen && (
                <Modal url="/CarSearchPage" text={"수정 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />
            )}
        </div>
    );
}
