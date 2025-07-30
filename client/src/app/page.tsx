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

            <div className="flex w-[100%] gap-10 p-25">
                <Sns />
                {/* TIP 바운딩 박스 */}
                <div className="relative w-full p-6 border-5 border-[#2E7D32] rounded-4xl bg-[#F5F5F5]">
                    {/* 중앙 TIP 텍스트 */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 bg-[#F5F5F5] z-10 text-[#D4B76A] text-4xl font-bold">
                        TIP
                    </div>

                    {/* TIP 콘텐츠 영역 */}
                    <div className="mt-4 text-center">
                        <p className="font-semibold text-xl mb-2">여름철 트럭 관리 요령 및 체크사항</p>
                        <p className="text-gray-500">이제 슬슬 날씨가 본격적인 하절기 시작에 접어드는 것 같습니다...</p>
                    </div>
                </div>
            </div>

            <div className="">매물</div>
        </div>
    );
}
