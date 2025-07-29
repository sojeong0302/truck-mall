"use client";

import { WritingDetailProps } from "./WritingDetail.types";
import { dummyData } from "@/data/dummy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function WritingDetail({ id }: WritingDetailProps) {
    const post = dummyData.find((item) => item.id === Number(id));

    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="w-[100%] flex">
            <div className="w-[100%] flex flex-col">
                <div className="">{post.title}</div>
                {post.images && post.images.length > 0 && (
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={10}
                        slidesPerView={3}
                        loop
                        className="w-full"
                    >
                        {post.images.map((src, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={src}
                                    alt={`truck-${index}`}
                                    className="w-full h-[200px] object-cover rounded shadow"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                <div className="">{post.content}</div>
            </div>
        </div>
    );
}
