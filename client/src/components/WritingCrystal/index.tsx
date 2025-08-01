// components/WritingCrystal.tsx
"use client";
import { useState } from "react";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";
import { WritingCrystalPropsStore } from "./WritingCrystal.types";

export default function WritingCrystal({ post }: { post: any }) {
    const handleSubmit = () => {
        alert("수정 되었습니다.");
    };
    const store = WritingCrystalPropsStore();
    const { title, setTitle, content, setContent } = store;

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
                <ShortButton onClick={handleSubmit} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
        </div>
    );
}
