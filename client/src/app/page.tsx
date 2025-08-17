"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Pagination, Autoplay } from "swiper/modules";
import Sns from "@/components/Sns";
import { useEffect } from "react";
import "swiper/css/navigation";
import Sale from "@/components/Sale";
import { useRouter } from "next/navigation";
import { useCarTipStore } from "@/store/carTipStore";
import { api } from "@/lib/api";

//메인 이미지
const images = ["/images/mainPoto/poto1.jpg", "/images/mainPoto/poto2.jpg", "/images/mainPoto/poto3.jpg"];

export default function MainPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { carTIPs, setCarTIPs } = useCarTipStore();
    const router = useRouter();

    // TIP가져오기
    useEffect(() => {
        const fetchCarTips = async () => {
            try {
                const res = await api.get(`/carTIP/list`);
                setCarTIPs(res.data);
            } catch (err) {}
        };

        fetchCarTips();
    }, [setCarTIPs]);

    return (
        <div className="w-[100%]">
            {/* 메인 사진 */}
            <div className="hidden sm:block relative w-full h-[600px]">
                <Swiper
                    modules={[EffectFade, Autoplay]}
                    effect="fade"
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    className="w-full h-full"
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={src}
                                alt={`슬라이드 이미지 ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* TIP 게시글 */}
            <div className="flex flex-col lg:flex-row w-full gap-10 p-6 sm:p-10 justify-center">
                <Sns />
                <div className="shadow-lg relative w-full max-w-screen-lg p-4 border-5 border-[#2E7D32] rounded-4xl bg-[#F5F5F5] flex flex-col sm:flex-row items-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 bg-[#F5F5F5] z-10 text-[#D4B76A] text-2xl sm:text-4xl font-bold">
                        TIP
                    </div>
                    {(carTIPs?.length ?? 0) === 0 ? (
                        <div className="w-full flex items-center justify-center py-16 text-gray-500">
                            등록된 글이 없습니다.
                        </div>
                    ) : (
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 10000, disableOnInteraction: false }}
                            loop={true}
                            className="w-full"
                        >
                            {carTIPs.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <div
                                        onClick={() => router.push(`/CarTIPDetailPage/${item.id}`)}
                                        className="flex items-center justify-center gap-10 p-12 sm:p-14 cursor-pointer"
                                    >
                                        {item.images &&
                                        item.images.length > 0 &&
                                        !item.images[0].startsWith("blob:") ? (
                                            <img
                                                src={item.images[0]}
                                                alt="대표 이미지"
                                                className="hidden sm:block shadow-lg w-[200px] h-[150px] object-cover rounded-xl mb-4 sm:mb-0"
                                            />
                                        ) : null}

                                        <div className="flex flex-col gap-3 sm:gap-5 justify-center">
                                            <p className="font-semibold text-lg sm:text-2xl">{item.title}</p>
                                            <p className="text-gray-500 line-clamp-3 text-sm sm:text-xl">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
            {/* 매물 게시글 */}
            <div className="w-full">
                <Sale />
            </div>
        </div>
    );
}
