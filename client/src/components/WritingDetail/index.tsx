"use client";
import { useState } from "react";
import { WritingDetailProps } from "./WritingDetail.types";
import { dummyData } from "@/data/dummy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

export default function WritingDetail({ id }: WritingDetailProps) {
    const post = dummyData.find((item) => item.id === Number(id));
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="w-[100%] ">
            <div className="w-[100%] flex flex-col justify-center items-center">
                <div>{post.title}</div>
                {post.images && post.images.length > 0 && (
                    <>
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
                                        className="w-full h-[200px] object-cover rounded shadow cursor-pointer"
                                        onClick={() => {
                                            setSelectedIndex(index);
                                            setOpen(true);
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={selectedIndex}
                            slides={post.images.map((src) => ({ src }))}
                        />
                    </>
                )}
                <div className="">{post.content}</div>
            </div>
            <div>버튼</div>
        </div>
    );
}
