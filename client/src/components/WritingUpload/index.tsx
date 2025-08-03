"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import axios from "axios";
import { useReviewUploadStore } from "@/app/ReviewUploadPage/ReviewUploadPage.types";
import { useImageStore } from "@/store/imageStore";

export default function WritingUpload({ url }: { url?: string }) {
    const { files } = useImageStore();
    const title = useReviewUploadStore((state) => state.title);
    const setTitle = useReviewUploadStore((state) => state.setTitle);
    const content = useReviewUploadStore((state) => state.content);
    const setContent = useReviewUploadStore((state) => state.setContent);
    const setImages = useReviewUploadStore((state) => state.setImages);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        files.forEach((file) => {
            formData.append("images", file);
        });

        // ✅ 경로 결정
        const uploadPath =
            url === "ReviewPage"
                ? "http://localhost:5000/review/uploadReview"
                : "http://localhost:5000/carTIP/uploadCarTIP";

        try {
            await axios.post(uploadPath, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("등록되었습니다.");
            setTitle("");
            setContent("");
            setImages([]);
            useImageStore.getState().clear();
        } catch (error) {
            console.error("등록 실패:", error);
            alert("등록에 실패했습니다.");
        }
    };

    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const handleCancellation = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="w-[80%] h-[100%] mx-auto flex flex-col justify-center p-20 gap-7">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                className="font-medium w-full text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            <EtcPoto setImages={setImages} />
            <TextArea setContent={setContent} />
            <div className="flex gap-3 justify-end">
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
