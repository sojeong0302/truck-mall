"use client";

import { use } from "react";
import { dummyData3 } from "@/data/dummy";
import ShortButton from "@/components/ShortButton";
import EtcPoto from "@/components/EtcPoto";
import TextArea from "@/components/TextArea";
import { SaleCrystalPagePropStore } from "./SaleCrystalPage.types";
import { useEffect } from "react";
import { useRef } from "react";

export default function SaleCrystalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const post = dummyData3.find((item) => item.id === Number(id));

    if (!post) {
        return <div className="p-10 text-red-600">해당 매물을 찾을 수 없습니다.</div>;
    }
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

    useEffect(() => {
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
    }, [post.name, post.fuel, post.type, post.trim, post.year, post.mileage, post.color, post.price, post.content]);

    const handleSubmit = () => {
        alert("수정 되었습니다.");
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 이미지 클릭 시 파일 탐색기 열기
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 시 이미지 바꾸기
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setThumbnail(imageUrl);
        }
    };

    return (
        <div className="w-full flex justify-center flex-col items-center p-15">
            <div className="w-[80%] flex flex-col gap-15">
                <div className="w-full flex justify-center gap-15">
                    <img
                        src={thumbnail}
                        className="cursor-pointer border-1 shadow-lg rounded-xl w-[50%] h-auto min-w-[150px]"
                        onClick={handleImageClick}
                    />
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
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">연료:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={fuel}
                                    onChange={(e) => setFuel(e.target.value)}
                                    placeholder="연료를 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">차체 타입:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="차체 타입을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">트림:</div>
                                <input
                                    value={trim}
                                    onChange={(e) => setTrim(e.target.value)}
                                    placeholder="트림을 입력해 주세요."
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">연식:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    placeholder="연식을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">주행거리:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={mileage}
                                    onChange={(e) => setMileage(e.target.value)}
                                    placeholder="주행거리를 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">색상:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="색상을 입력해 주세요."
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="font-bold">가격:</div>
                                <input
                                    className="flex-1 shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-2"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="가격을 입력해 주세요."
                                />
                            </div>
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
        </div>
    );
}
