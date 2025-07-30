"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Sns from "@/components/Sns";

const images = ["/images/mainPoto/poto1.jpg", "/images/mainPoto/poto2.jpg", "/images/mainPoto/poto3.jpg"];

export default function MainPage() {
    return (
        <div className="w-[100%]">
            {/* 메인 사진 */}
            <div className="relative w-full h-[600px]">
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

            <div className="flex w-[80%] justify-center">
                <Sns />
                <div>중간 오른쪽</div>
            </div>
            <div className="">매물</div>
        </div>
    );
}
