"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";

export default function WritingUpload({ url }: { url?: string }) {
    const handleSubmit = () => {
        alert("등록 되었습니다.");
    };
    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const handleCancellation = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="w-[80%] h-[100%] mx-auto flex flex-col justify-center p-20 gap-7">
            <input
                placeholder="제목을 입력해 주세요."
                className="font-medium w-full text-3xl border-b-2 border-[#575757] p-4 focus:outline-none"
            />
            <EtcPoto />
            <TextArea />
            <div className="flex gap-3 justify-end">
                <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                    등록하기
                </ShortButton>
                <ShortButton onClick={handleCancellation} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
            {isModalOpen && <Modal url={url} text={"수정 중인 내용이 모두 삭제됩니다.\n그래도 취소하시겠습니까?"} />}
        </div>
    );
}
