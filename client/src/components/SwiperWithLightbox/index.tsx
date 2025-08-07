"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Lightbox from "yet-another-react-lightbox";
import { useLightboxStore } from "@/store/lightboxStore";

export default function SwiperWithLightbox({ images }: { images: string[] }) {
    const { open, selectedIndex, setOpen, setSelectedIndex } = useLightboxStore();

    return (
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
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                }}
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            onClick={() => {
                                setSelectedIndex(index);
                                setOpen(true);
                            }}
                            src={src}
                            alt={`truck-${index}`}
                            className="w-full h-[200px] object-cover shadow cursor-pointer border border-black"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="custom-prev absolute -left-0 top-1/2 -translate-y-1/2 text-[#2E7D32] text-4xl z-10 cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95">
                ❮
            </div>
            <div className="custom-next absolute -right-0 top-1/2 -translate-y-1/2 text-[#2E7D32] text-4xl z-10 cursor-pointer transition transform duration-200 hover:scale-110 active:scale-95">
                ❯
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={selectedIndex}
                slides={images.map((src) => ({ src }))}
            />
        </div>
    );
}
