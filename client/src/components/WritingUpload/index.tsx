"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import axios from "axios";
import { useReviewUploadStore } from "@/app/ReviewUploadPage/ReviewUploadPage.types";
import { useImageStore } from "@/store/imageStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Post {
    id: number;
    title: string;
    content: string;
    images?: string[];
}

// URL들을 fetch해서 File로 변환하는 예시
async function urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").pop() || "file.jpg";
    return new File([blob], fileName, { type: blob.type });
}

export default function WritingUpload({ post, url }: { post: Post; url?: string }) {
    const { files } = useImageStore();
    const { previews, originURLs } = useImageStore();
    const title = useReviewUploadStore((state) => state.title);
    const setTitle = useReviewUploadStore((state) => state.setTitle);
    const content = useReviewUploadStore((state) => state.content);
    const setContent = useReviewUploadStore((state) => state.setContent);
    const setImages = useReviewUploadStore((state) => state.setImages);
    const router = useRouter();
    const handleSubmit = async () => {
        const currentPrevImageURLs = previews.filter((p) => originURLs.includes(p));
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        currentPrevImageURLs.forEach((url) => formData.append("prevImages", url));
        files.forEach((file) => formData.append("images", file));

        const isEdit = !!post?.id;

        // ✅ 실제 endpoint로 사용할 변수
        const endpoint =
            url === "ReviewPage"
                ? "http://localhost:5000/review/uploadReview"
                : "http://localhost:5000/carTIP/uploadCarTIP";

        try {
            const res = await fetch(endpoint, {
                method: isEdit ? "PATCH" : "POST",
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                alert(`오류 발생: ${err.error}`);
                return;
            }

            alert(isEdit ? "수정되었습니다." : "등록되었습니다.");
            setTitle("");
            setContent("");
            setImages([]);
            useImageStore.getState().clear();
            router.push(`/${url}`);
        } catch (err) {
            console.error("요청 실패", err);
            alert("서버 오류");
        }
    };

    useEffect(() => {
        if (post) {
            setTitle("");
            setContent("");
            setImages([]);

            setTimeout(() => {
                setTitle(post.title || "");
                setContent(post.content || "");
                setImages(files);
            }, 0);
        }
    }, [post?.id, setTitle, setContent, setImages]);

    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const handleCancellation = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="w-[90%] sm:w-[80%] h-[100%] mx-auto flex flex-col justify-center p-0 sm:p-20 gap-7">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                className="font-medium w-full  text-xl sm:text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            <EtcPoto initialImages={post?.images || []} />
            <TextArea setContent={setContent} />
            <div className="flex gap-3 justify-end sm:mb-0 mb-5">
                <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                    등록하기
                </ShortButton>
                <ShortButton onClick={handleCancellation} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
            {isModalOpen && <Modal url={url} text={"작성 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />}
        </div>
    );
}
