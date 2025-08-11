"use client";
import "swiper/css";
import "swiper/css/navigation";
import "yet-another-react-lightbox/styles.css";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";
import SwiperWithLightbox from "@/components/SwiperWithLightbox";
import { useAuthStore } from "@/store/useAuthStore";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { getClientToken } from "@/utils/auth";
import { getImageUrl } from "@/utils/getImageUrl";

interface Post {
    id: number;
    title: string;
    content: string;
    images?: string[];
}

export default function WritingDetail({
    id,
    post,
    deletePath,
    crystalPath,
    url,
}: {
    id: string;
    post: Post;
    deletePath: string;
    crystalPath: string;
    url: string;
}) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const store = useModalStore();
    const router = useRouter();
    const { isModalOpen, setIsModalOpen } = store;
    const { isLoggedIn } = useAuthStore();

    // 수정 페이지 이동
    const handleGoCrystal = () => {
        router.push(`/${crystalPath}/${id}`);
    };

    // 글 삭제
    const handleDelete = async () => {
        const token = getClientToken();
        try {
            const res = await fetch(`${BASE_URL}/${deletePath}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            router.back();
        } catch (error) {}
    };

    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }
    return (
        <div className="w-[100%] p-0 sm:p-10 flex flex-col gap-5 items-center">
            {!post ? (
                <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>
            ) : (
                <>
                    {isLoggedIn && (
                        <div className="flex w-[90%] sm:w-[80%] justify-end gap-2 p-4 text-sm">
                            <div onClick={handleGoCrystal} className="cursor-pointer">
                                수정
                            </div>
                            |
                            <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                삭제
                            </div>
                        </div>
                    )}

                    <div className="w-[90%] sm:w-[80%] flex flex-col justify-center items-center gap-10">
                        <div className="font-medium w-[100%] text-3xl border-b-2 border-[#575757] p-4">
                            {post.title}
                        </div>
                        {post.images && post.images.length > 0 && (
                            <SwiperWithLightbox images={post.images.map((img) => getImageUrl(img))} />
                        )}
                        <div className="text-2xl w-full bg-white border-4 border-[#2E7D32] p-4 rounded-md">
                            {post.content}
                        </div>
                    </div>

                    <div className="flex justify-end w-[90%] sm:w-[80%] sm:mb-0 mb-5">
                        <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                            목록으로
                        </ShortButton>
                    </div>
                </>
            )}
            {isModalOpen && (
                <Modal onConfirm={handleDelete} text={"삭제된 내용은 복구할 수 없습니다.\n정말 삭제하시겠습니까?"} />
            )}
        </div>
    );
}
