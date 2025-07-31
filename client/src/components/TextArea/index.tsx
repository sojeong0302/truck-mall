"use client";
import { TextAreaProps } from "./TextArea.types";

export default function TextArea({ value, onChange }: TextAreaProps) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            className="text-2xl w-full h-[400px] bg-white border-4 border-[#2E7D32] p-4 rounded-md focus:outline-none resize-none"
            placeholder="내용을 입력해 주세요."
        />
    );
}
