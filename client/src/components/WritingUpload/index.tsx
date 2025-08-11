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
import { WritingUploadProps } from "./WritingUpload.types";
import { getClientToken } from "@/utils/auth";

const joinUrl = (base: string | undefined, path: string) =>
    `${(base || "").replace(/\/+$/, "")}/${(path || "").replace(/^\/+/, "")}`;

const toAbsolute = (base: string | undefined, url: string) => (/^https?:\/\//i.test(url) ? url : joinUrl(base, url));

const toRelative = (u: string) => {
    try {
        if (/^https?:\/\//i.test(u)) return new URL(u).pathname.replace(/^\/?/, "/");
        return `/${u.replace(/^\/+/, "")}`;
    } catch {
        return u;
    }
};

/* 서버 저장 이미지를 파일로 바꿀 때, 상대경로면 절대경로로 보정 */
async function urlToFile(url: string, base?: string): Promise<File> {
    const abs = toAbsolute(base, url);
    const res = await fetch(abs);
    const blob = await res.blob();
    const fileName = abs.split("/").pop() || "file.jpg";
    return new File([blob], fileName, { type: blob.type });
}

export default function WritingUpload({ post, url }: WritingUploadProps) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { files, previews, originURLs } = useImageStore();
    const title = useReviewUploadStore((state) => state.title);
    const setTitle = useReviewUploadStore((state) => state.setTitle);
    const content = useReviewUploadStore((state) => state.content);
    const setContent = useReviewUploadStore((state) => state.setContent);
    const setImages = useReviewUploadStore((state) => state.setImages);
    const { isModalOpen, setIsModalOpen } = useModalStore();

    const handleSubmit = async () => {
        const currentPrevImageURLs = previews.filter((p) => originURLs.includes(p));
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        currentPrevImageURLs.forEach((url) => formData.append("prevImages", url));
        const kept = previews.filter((p) => originURLs.includes(p)).map(toRelative);
        kept.forEach((u) => formData.append("prevImages", u));

        // 새로 추가된 파일들
        files.forEach((f) => formData.append("images", f));

        const endpoint = joinUrl(BASE_URL, url === "ReviewPage" ? "/review/uploadReview" : "/carTIP/uploadCarTIP");
        try {
            const token = getClientToken();
            const res = await axios.post(endpoint, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("등록되었습니다.");
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
        const init = async () => {
            if (post) {
                useImageStore.getState().clear();

                const fileList: File[] = [];

                if (post.images && post.images.length > 0) {
                    for (const url of post.images) {
                        const file = await urlToFile(url);
                        fileList.push(file);
                    }
                }

                setTitle(post.title || "");
                setContent(post.content || "");
                const list: File[] = [];
                if (post.images?.length) {
                    for (const u of post.images) {
                        list.push(await urlToFile(u, BASE_URL));
                    }
                }
                setImages(list);
            }
        };

        init();
    }, [post?.id]);

    const handleCancellation = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        return () => {
            useImageStore.getState().clear();
        };
    }, []);

    return (
        <div className="w-[90%] sm:w-[80%] h-[100%] mx-auto flex flex-col justify-center p-0 sm:p-20 gap-7">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                className="font-medium w-full  text-xl sm:text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            <EtcPoto initialImages={post?.images || []} />
            <TextArea value={content} setContent={setContent} />
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
