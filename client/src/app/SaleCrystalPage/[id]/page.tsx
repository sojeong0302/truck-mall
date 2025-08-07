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
    const [images, setImages] = useState<string[]>([]);
    const [post, setPost] = useState<SaleProps | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/sale/${id}`);
                setPost(res.data);
            } catch (error) {}
        };
        fetchPost();
    }, [id]);

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
    }, [post]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            if (thumbnail?.startsWith("blob:")) {
                URL.revokeObjectURL(thumbnail);
            }

            setThumbnail(imageUrl);
        }
    };

    const handleSubmit = async () => {
        if (!post) return;

        try {
            await axios.put(`http://localhost:5000/sale/${id}`, {
                name,
                fuel,
                type,
                trim,
                year,
                mileage,
                color,
                price,
                thumbnail,
                content,
                images,
                tag: {
                    manufacturer: (post as any).manufacturer ?? "",
                    model: (post as any).model ?? "",
                    subModel: (post as any).sub_model ?? "",
                    grade: (post as any).grade ?? "",
                },
            });
            alert("수정되었습니다.");
            router.push("/");
        } catch (error) {}
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
                    <div className="w-full flex flex-col sm:flex-row justify-center gap-5 sm:gap-15">
                        {thumbnail ? (
                            <img
                                src={thumbnail}
                                alt="썸네일"
                                className="border-1 shadow-lg rounded-xl  w-[500px] sm:h-[500px] h-[300px]"
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

                    <EtcPoto initialImages={post.images ?? []} setImages={setImages} />
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
