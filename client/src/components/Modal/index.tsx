"use client";
import { useRouter } from "next/navigation";
import ShortButton from "../ShortButton";
import { useModalStore } from "@/store/ModalStateStroe";

export default function Modal({ text, url }: { text: string; url?: string }) {
    const router = useRouter();
    const store = useModalStore();
    const { isModalOpen, setIsModalOpen } = store;
    const handleYes = () => {
        setIsModalOpen(false);
        if (url) router.push(url);
    };
    const handleNo = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="border-5 border-[#2E7D32] flex flex-col items-center p-10 bg-white rounded-xl shadow-lg min-w-[300px] max-w-[90%]">
                <img className="w-20" src="/images/warning.png" alt="경고" />
                <div className="text-center text-xl font-medium p-5 whitespace-pre-line">{text}</div>
                <div className="flex gap-3">
                    <ShortButton onClick={handleYes} className="bg-[#2E7D32] text-white">
                        네
                    </ShortButton>
                    <ShortButton onClick={handleNo} className="bg-gray-200">
                        아니요
                    </ShortButton>
                </div>
            </div>
        </div>
    );
}
