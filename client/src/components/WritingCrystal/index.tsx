"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import { useWritingCrystalPropsStore } from "./WritingCrystal.types";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useEffect, useCallback, useMemo } from "react";
import { useImageStore } from "@/store/imageStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api";

interface Post {
    id: number;
    title: string;
    content: string;
    images?: string[];
}

export default function WritingCrystal({ post, url }: { post: Post; url?: string }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const { previews, files, originURLs } = useImageStore();
    const token = useAuthStore((s) => s.token);
    const { title, setTitle, content, setContent, prevImages, setPrevImages, newImages, setNewImages, clearAll } =
        useWritingCrystalPropsStore();
    const router = useRouter();

    useEffect(() => {
        if (!post) return;
        clearAll();
        // 폼 기본값 세팅
        setTitle(post.title);
        setContent(post.content);
        setPrevImages(post.images || []);
    }, [post, clearAll, setTitle, setContent, setPrevImages]);

    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url}`;
    };

    const initialImageUrls = useMemo(() => (post.images || []).map((img) => getImageUrl(img)), [post.images, BASE_URL]);

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
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        // ✅ 남길 기존 이미지들
        prevImages.forEach((url) => formData.append("prevImages", url));
        // ✅ 새로 추가한 파일들
        newImages.forEach((file) => formData.append("images", file));

        const baseURL = url === "ReviewPage" ? `${BASE_URL}/review/${post.id}` : `${BASE_URL}/carTIP/${post.id}`;

        try {
            await authApi.patch(baseURL, formData);
            alert("수정 되었습니다.");
            clearAll();
            router.back();
        } catch (e) {
            console.error("수정 실패", e);
            alert("서버 오류");
        }
    };

    useEffect(() => {
        useImageStore.getState().clear();
    }, [post]);

    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }
    const handleImagesChange = useCallback(
        (files: File[], keepImages: string[]) => {
            setNewImages(files);
            setPrevImages(keepImages);
        },
        [setNewImages, setPrevImages]
    );

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="sm:w-[80%] w-[90%] h-[100%] mx-auto flex flex-col justify-center sm:p-20 p-0 gap-7">
            <input
                placeholder="제목을 입력해 주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium w-full text-xl sm:text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            <EtcPoto initialImages={initialImageUrls} onChange={handleImagesChange} />
            <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex gap-3 justify-end sm:mb-0 mb-5">
                <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                    수정하기
                </ShortButton>
                <ShortButton onClick={() => setIsModalOpen(true)} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
            {isModalOpen && (
                <Modal onConfirm={handleCancel} text={"수정 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />
            )}
        </div>
    );
}
