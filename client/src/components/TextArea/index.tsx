"use client";
import { TextAreaProps } from "./TextArea.types";

export default function TextArea({ value, onChange, setContent }: TextAreaProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        setContent?.(e.target.value);
    };
    return (
        <textarea
            value={value}
            onChange={handleChange}
            className="text-xl sm:text-2xl w-full sm:h-[400px] h-[200px] bg-white border-4 border-[#2E7D32] p-4 rounded-md focus:outline-none resize-none"
            placeholder="내용을 입력해 주세요."
        />
    );
}
