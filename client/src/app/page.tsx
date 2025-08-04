"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Sns from "@/components/Sns";
import { dummyData } from "@/data/dummy";
import { useEffect, useState } from "react";
import "swiper/css/navigation";
import Sale from "@/components/Sale";
import { dummyData3 } from "@/data/dummy";
import axios from "axios";

const images = ["/images/mainPoto/poto1.jpg", "/images/mainPoto/poto2.jpg", "/images/mainPoto/poto3.jpg"];

export default function MainPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const dataLength = dummyData.length;
    const [carTIPs, setCarTIPs] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % dataLength);
        }, 10000);

        return () => clearInterval(interval);
    }, [dataLength]);

    // TIP가져오기
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("http://localhost:5000/carTIP/list");
                setCarTIPs(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("리뷰 불러오기 실패:", err);
            }
        };

        fetchReviews();
    }, []);

    const current = dummyData[currentIndex];

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

            <div className="flex w-[100%] gap-10 p-25 justify-center">
                <Sns />
                {/* TIP 바운딩 박스 */}
                <div className="shadow-lg relative w-[80%] p-4 border-5 border-[#2E7D32] rounded-4xl bg-[#F5F5F5] flex items-around">
                    {/* 중앙 TIP 텍스트 */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 bg-[#F5F5F5] z-10 text-[#D4B76A] text-4xl font-bold">
                        TIP
                    </div>
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
                                <div className="flex items-center justify-center gap-10 p-15">
                                    {item.images && item.images.length > 0 && (
                                        <img
                                            src={item.images[0]}
                                            alt="대표 이미지"
                                            className="shadow-lg w-[200px] h-[150px] object-cover rounded-xl mb-4"
                                        />
                                    )}
                                    <div className="flex flex-col gap-5 justify-center">
                                        <p className="font-semibold text-2xl">{item.title}</p>
                                        <p className="text-gray-500 line-clamp-3 text-xl">{item.content}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <div className="w-full">
                <Sale posts={dummyData3} basePath="" />
            </div>
        </div>
    );
}
