"use client";

import { use } from "react";
import { dummyData3 } from "@/data/dummy";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const post = dummyData3.find((item) => item.id === Number(id));
    const router = useRouter();
    if (!post) {
        return <div className="p-10 text-red-500">해당 게시물을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="w-full flex justify-center flex-col items-center p-15">
            <div className="w-[80%] flex flex-col gap-15">
                <div className="w-full flex justify-center gap-15">
                    <img src={post.thumbnail} className="border-1 shadow-lg rounded-xl w-[50%] h-auto min-w-[150px]" />
                    <div className="flex flex-col justify-around">
                        <div className="font-bold text-4xl border-b-2 border-[#575757] p-2">{post.name}</div>
                        <div className="flex flex-col text-2xl p-2 gap-5">
                            <div className="flex gap-3">
                                <div className="font-bold">연료:</div>
                                <div>{post.fuel}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">차체 타입:</div>
                                <div>{post.type}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">트림:</div>
                                <div>{post.trim}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">연식:</div>
                                <div>{post.year}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">주행거리:</div>
                                <div>{post.mileage}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">색상:</div>
                                <div>{post.color}</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="font-bold">가격:</div>
                                <div className="text-[#C62828]">{post.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {post.images && post.images.length > 0 && <SwiperWithLightbox images={post.images} />}
                <div className="text-2xl w-full bg-white border-4 border-[#2E7D32] p-4 rounded-md">{post.content}</div>
                <div className="flex justify-end">
                    <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                        뒤로가기
                    </ShortButton>
                </div>
            </div>
        </div>
    );
}
