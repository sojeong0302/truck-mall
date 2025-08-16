"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useReviewUploadStore } from "@/app/ReviewUploadPage/ReviewUploadPage.types";
import { useImageStore } from "@/store/imageStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WritingUploadProps } from "./WritingUpload.types";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api";

export default function WritingUpload({ post, url }: WritingUploadProps) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const router = useRouter();
    const token = useAuthStore((s) => s.token);

    // ✅ 업로드는 useImageStore만 단일 소스로 사용
    const { files, previews, originURLs, clear } = useImageStore();

    const title = useReviewUploadStore((state) => state.title);
    const setTitle = useReviewUploadStore((state) => state.setTitle);
    const content = useReviewUploadStore((state) => state.content);
    const setContent = useReviewUploadStore((state) => state.setContent);
    const { isModalOpen, setIsModalOpen } = useModalStore();

    const handleSubmit = async () => {
        // 토큰 없으면 로그인 페이지 이동
        if (!token) {
            alert("로그인이 필요합니다.");
            const here = window.location.pathname + window.location.search;
            requestAnimationFrame(() => {
                router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            });
            return;
        }
        // 기존 이미지(URL) 중 남겨둘 것만 prevImages로 전송
        const currentPrevImageURLs = previews.filter((p) => originURLs.includes(p));

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        currentPrevImageURLs.forEach((u) => formData.append("prevImages", u));
        files.forEach((f) => formData.append("images", f)); // 새로 추가된 파일만 업로드

        const endpoint = url === "ReviewPage" ? `${BASE_URL}/review/uploadReview` : `${BASE_URL}/carTIP/uploadCarTIP`;

        try {
            await authApi.post(endpoint, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("등록되었습니다.");
            setTitle("");
            setContent("");
            clear();
            router.push(`/${url}`);
        } catch (err) {
            console.error("요청 실패", err);
            alert("서버 오류");
        }
    };

    // 편집 진입 시: 기존 이미지 URL은 EtcPoto의 initialImages로만 처리 (File로 변환 X)
    useEffect(() => {
        clear();
        if (post) {
            setTitle(post.title || "");
            setContent(post.content || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post?.id]);

    // 언마운트 시 이미지 스토어 정리
    useEffect(() => {
        return () => {
            clear();
        };
    }, [clear]);

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="w-[90%] sm:w-[80%] h-[100%] mx-auto flex flex-col justify-center p-0 sm:p-20 gap-7">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                className="font-medium w-full text-xl sm:text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            {/* 기존 이미지(URL)는 initialImages로 넘겨서 prevImages 관리 */}
            <EtcPoto initialImages={post?.images || []} />
            <TextArea value={content} setContent={setContent} />
            <div className="flex gap-3 justify-end sm:mb-0 mb-5">
                <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                    등록하기
                </ShortButton>
                <ShortButton onClick={() => setIsModalOpen(true)} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
            {isModalOpen && (
                <Modal onConfirm={handleCancel} text={"작성 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />
            )}
        </div>
    );
}
