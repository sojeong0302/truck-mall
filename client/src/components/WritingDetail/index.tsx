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

export default function WritingDetail({ post }: { post: any }) {
    const { open, selectedIndex, setOpen, setSelectedIndex } = useLightboxStore();
    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }
    const router = useRouter();
    return (
        <div className="w-[100%] p-10 flex flex-col gap-5">
            <div className="w-[100%] flex flex-col justify-center items-center gap-10">
                <div className="font-medium w-[100%] text-3xl border-b-2 border-[#575757] p-4">{post.title}</div>
                {post.images && post.images.length > 0 && (
                    <>
                        <div className="relative w-full px-20">
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: ".custom-next",
                                    prevEl: ".custom-prev",
                                }}
                                spaceBetween={10}
                                slidesPerView={4}
                                loop
                            >
                                {post.images.map((src: string, index: number) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            onClick={() => {
                                                setSelectedIndex(index);
                                                setOpen(true);
                                            }}
                                            src={src}
                                            alt={`truck-${index}`}
                                            className="w-full h-[200px] object-cover rounded shadow cursor-pointer"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* 사진 영역 바깥에 화살표 수동 배치 */}
                            <div className="custom-prev absolute -left-0 top-1/2 -translate-y-1/2 text-[#2E7D32] text-4xl z-10 cursor-pointer">
                                ❮
                            </div>
                            <div className="custom-next absolute -right-0 top-1/2 -translate-y-1/2 text-[#2E7D32] text-4xl z-10 cursor-pointer">
                                ❯
                            </div>
                            <Lightbox
                                open={open}
                                close={() => setOpen(false)}
                                index={selectedIndex}
                                slides={post.images.map((src: string) => ({ src }))}
                            />
                        </div>
                    </>
                )}
                <div className="text-2xl w-full bg-white border-4 border-[#2E7D32] p-4 rounded-md">{post.content}</div>
            </div>
            <div className="flex justify-end">
                <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                    뒤로가기
                </ShortButton>
            </div>
        </div>
    );
}
