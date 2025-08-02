"use client";
import { TextAreaProps } from "./TextArea.types";

export default function TextArea({ value, onChange, setContent }: TextAreaProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e); // 상위에서도 변경 감지하고 싶다면 유지
        setContent?.(e.target.value); // 외부 상태 업데이트
    };
    return (
        <textarea
            value={value}
            onChange={handleChange}
            className="text-2xl w-full h-[400px] bg-white border-4 border-[#2E7D32] p-4 rounded-md focus:outline-none resize-none"
            placeholder="내용을 입력해 주세요."
        />
    );
}
