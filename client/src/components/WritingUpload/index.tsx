"use client";
import EtcPoto from "../EtcPoto";
import ShortButton from "../ShortButton";
import TextArea from "../TextArea";

export default function WritingUpload() {
    const handleSubmit = () => {
        alert("등록 되었습니다.");
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
                <ShortButton onClick={handleSubmit} className="bg-white border-3 border-[#2E7D32]">
                    취소
                </ShortButton>
            </div>
        </div>
    );
}
