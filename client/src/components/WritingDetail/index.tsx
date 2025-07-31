"use client";

import "swiper/css";
import "swiper/css/navigation";
import "yet-another-react-lightbox/styles.css";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";

export default function WritingDetail({ post }: { post: any }) {
    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }
    const router = useRouter();
    return (
        <div className="w-[100%] p-10 flex flex-col gap-5 items-center">
            <div className="w-[80%] flex flex-col justify-center items-center gap-10">
                <div className="font-medium w-[100%] text-3xl border-b-2 border-[#575757] p-4">{post.title}</div>
                {post.images && post.images.length > 0 && <SwiperWithLightbox images={post.images} />}
                <div className="text-2xl w-full bg-white border-4 border-[#2E7D32] p-4 rounded-md">{post.content}</div>
            </div>
            <div className="flex justify-end w-[80%]">
                <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                    뒤로가기
                </ShortButton>
            </div>
        </div>
    );
}
