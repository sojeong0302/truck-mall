"use client";
import { WritingDetailProps } from "./WritingDetail.types";
import { dummyData } from "@/data/dummy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useLightboxStore } from "@/store/lightboxStore";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";

export default function WritingDetail({ id }: WritingDetailProps) {
    const post = dummyData.find((item) => item.id === Number(id));
    const { open, selectedIndex, setOpen, setSelectedIndex } = useLightboxStore();
    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }
    const router = useRouter();
    return (
        <div className="w-[100%] p-10">
            <div className="w-[100%] flex flex-col justify-center items-center">
                <div>{post.title}</div>
                {post.images && post.images.length > 0 && (
                    <>
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={10}
                            slidesPerView={4}
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
            <div className="flex justify-end">
                <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                    뒤로가기
                </ShortButton>
            </div>
        </div>
    );
}
