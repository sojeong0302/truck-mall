"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import { useWritingCrystalPropsStore } from "./WritingCrystal.types";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useEffect } from "react";
import { useImageStore } from "@/store/imageStore";
import { useRouter } from "next/navigation";

export default function WritingCrystal({ post, url }: { post: any; url?: string }) {
    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const { previews, files, originURLs } = useImageStore();
    const {
        title,
        setTitle,
        content,
        setContent,
        prevImages,
        setPrevImages,
        removePrevImage,
        newImages,
        setNewImages,
    } = useWritingCrystalPropsStore();
    const router = useRouter();

    useEffect(() => {
        if (post) {
            useWritingCrystalPropsStore.getState().clearAll();

            setTimeout(() => {
                setTitle(post.title);
                setContent(post.content);
                setPrevImages(post.images || []);
            }, 0);
        }
    }, [post?.id]);

    const handleSubmit = async () => {
        const currentPrevImageURLs = previews.filter((p) => originURLs.includes(p));

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        currentPrevImageURLs.forEach((url) => formData.append("prevImages", url));
        files.forEach((file) => formData.append("images", file));

        // ✅ URL에 따라 API 경로 다르게 설정
        const baseURL =
            url === "ReviewPage"
                ? `http://localhost:5000/review/${post.id}`
                : `http://localhost:5000/carTIP/${post.id}`;

        try {
            const res = await fetch(baseURL, {
                method: "PATCH",
                body: formData,
            });
            console.log("전송되는 제목:", title);
            console.log("전송되는 내용:", content);

            if (res.ok) {
                alert("수정 되었습니다.");
                useWritingCrystalPropsStore.getState().clearAll();
                router.back();
            } else {
                const err = await res.json();
                alert(`수정 실패: ${err.error || "알 수 없는 오류"}`);
            }
        } catch (e) {
            console.error("수정 실패", e);
            alert("서버 오류");
        }
    };

    const handleCancellation = () => {
        setIsModalOpen(true);
    };
    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }
    return (
        <div className="w-[80%] h-[100%] mx-auto flex flex-col justify-center p-20 gap-7">
            <input
                placeholder="제목을 입력해 주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium w-full text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            <EtcPoto initialImages={post.images} />
            <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex gap-3 justify-end">
                <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                    수정하기
                </ShortButton>
                <ShortButton onClick={handleCancellation} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
            {isModalOpen && <Modal url={url} text={"수정 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />}
        </div>
    );
}
