"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import { useWritingCrystalPropsStore } from "./WritingCrystal.types";
import Modal from "../Modal";
import { useModalStore } from "@/store/ModalStateStroe";
import { useEffect, useState } from "react";

export default function WritingCrystal({ post, url }: { post: any; url?: string }) {
    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const { title, setTitle, content, setContent } = useWritingCrystalPropsStore();

    const handleSubmit = () => {
        alert("수정 되었습니다.");
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
