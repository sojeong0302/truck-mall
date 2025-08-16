"use client";

import { useRef, useState, useMemo } from "react";
import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const categories = ["트럭팔기", "트럭할부", "트럭구매", "기타"];

export default function AdvicePage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = (category: string) => {
        setSelected([...selected, category]);
    };

    const handleRemove = (category: string) => {
        setSelected(selected.filter((item) => item !== category));
    };

    const checkboxRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const numberInputRef = useRef<HTMLInputElement>(null);

    const dateChars = useMemo(() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        return `${yyyy}/${mm}/${dd}`.split("");
    }, []);

    const parts = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const handleSubmit = async () => {
        // const isAgreed = checkboxRef.current?.checked;
        // const nameValue = nameInputRef.current?.value.trim();
        // const numberValue = numberInputRef.current?.value.trim();
        // if (!isAgreed) {
        //     alert("개인정보 수집 및 이용에 동의해 주세요.");
        //     return;
        // }
        // if (!nameValue) {
        //     alert("성함을 입력해 주세요.");
        //     return;
        // }
        // if (!numberValue) {
        //     alert("전화번호를 입력해 주세요.");
        //     return;
        // }
        // alert("상담신청이 완료되었습니다.\n담당자가 연락을 드리겠습니다.");
        // // ✅ 문자 전송 요청
        // try {
        //     await fetch("http://localhost:5000/sms/send", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             to: "+821063564187", // Twilio는 국제번호 형식 필수 (한국은 +82)
        //             body: `[상담신청]\n성함: ${nameValue}\n전화번호: ${numberValue}`,
        //         }),
        //     });
        //     alert("상담신청이 완료되었습니다.\n담당자가 연락을 드리겠습니다.");
        //     router.push("/");
        // } catch (err) {
        //     console.error("SMS 전송 실패", err);
        //     alert("문자 전송 중 오류가 발생했습니다.");
        // }
        alert("서비스 구현중 입니다.\n010-8191-8244로 연락 주세요.");
    };

    return (
        <div className="w-[100%] flex flex-col items-center gap-10 p-5 sm:p-10">
            {/* 개인정보 수집 */}
            <div className="w-[100%] sm:w-[70%] flex flex-col gap-3">
                <div className="text-xl sm:text-4xl">문의: 010-8191-8244</div>
                <div className=" text-base w-full bg-white border-4 border-[#2E7D32] p-4 rounded-sm overflow-auto max-h-[150px] sm:max-h-[200px]">
                    <pre className="whitespace-pre-wrap font-sans text-base sm:text-lg">
                        {`<개인정보 수집 및 이용 동의 안내>

1. 수집 항목
- 필수: 성함, 전화번호
- 선택: 차량명, 톤수, 기타사항, 카테고리

2. 수집 목적
- 상담 요청에 대한 확인 및 회신
- 요청하신 차량 관련 문의 대응 및 맞춤 상담 제공

3. 보유 및 이용 기간
- 수집일로부터 1년간 보관 후 지체 없이 파기
  (단, 관련 법령에 따라 일정 기간 보존할 수 있음)

4. 동의를 거부할 권리 및 불이익
- 귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
- 다만, 필수 항목 수집에 동의하지 않을 경우 상담 신청이 제한될 수 있습니다.`}
                    </pre>
                </div>
                <div className="flex gap-2 p-1">
                    <input
                        type="checkbox"
                        id="privacyAgree"
                        ref={checkboxRef}
                        className="w-5 h-5 accent-[#2E7D32] transition transform duration-200 hover:scale-110 active:scale-95"
                    />
                    <div className="sm:text-base text-sm"> 개인정보 수집 및 이용에 동의합니다.</div>
                </div>
            </div>

            {/* 상담지 */}
            <div className="w-[100%] sm:w-[70%] border-4 border-[#2E7D32] rounded-4xl">
                <div className="w-[100%] flex justify-between p-5 sm:p-10 flex bg-[rgba(46,125,50,0.25)] rounded-t-3xl">
                    <div className="flex flex-col gap-3 justify-center">
                        <div className="text-2xl sm:text-4xl font-bold">상담하기</div>
                        <div className="flex gap-1">
                            <div className="text-2xl text-[#D7263D]">*</div>
                            <div className="text-sm sm:text-xl">표시된 항목은 필수 입력사항 입니다.</div>
                        </div>
                    </div>
                    <div className="hidden sm:flex w-[20%] flex-col justify-center gap-3">
                        <div className="w-full flex items-center gap-3">
                            <div className="w-[30%] flex justify-between font-medium text-lg">
                                <div>담</div>
                                <div>당</div>
                                <div>자</div>
                            </div>
                            <div className="w-[70%] flex justify-between bg-white p-1 rounded-md p-2 text-[#6B6B6B] text-sm">
                                <div>김</div>
                                <div>달</div>
                                <div>영</div>
                            </div>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <div className="w-[30%] flex justify-between font-medium text-lg">
                                <div>날</div>
                                <div>짜</div>
                            </div>
                            <div className="w-[70%] flex justify-between bg-white p-1 rounded-md p-2 text-[#6B6B6B] text-sm">
                                {dateChars.map((char, idx) => (
                                    <span key={idx}>{char}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] flex flex-col bg-white p-5 sm:p-15 gap-10 rounded-b-4xl shadow-lg">
                    <div className="w-[100%] flex flex-col gap-5 sm:gap-10">
                        <div className="w-[100%] flex flex-col gap-1">
                            <div className="flex gap-1">
                                <div className="text-lg sm:text-xl font-semibold">성함</div>
                                <div className="text-2xl text-[#D7263D]">*</div>
                            </div>
                            <input
                                ref={nameInputRef}
                                placeholder="성함을 입력해 주세요."
                                className="sm:w-[50%] w-[100%] shadow-md text-lg sm:text-xl border-2 border-[#2E7D32] rounded-xl p-2 sm:p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                                <div className="text-lg sm:text-xl font-semibold">전화번호</div>
                                <div className="text-[#D7263D] text-2xl">*</div>
                            </div>
                            <input
                                type="tel"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                ref={numberInputRef}
                                placeholder="전화번호를 입력해 주세요. (숫자만 입력)"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/[^0-9]/g, "");
                                }}
                                className="sm:w-[50%] w-[100%] shadow-md text-lg sm:text-xl border-2 border-[#2E7D32] rounded-xl p-2 sm:p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg sm:text-xl font-semibold">차량명</div>
                            <input
                                placeholder="차량명을 입력해 주세요."
                                className="shadow-md text-lg sm:text-xl border-2 border-[#2E7D32] rounded-xl p-2 sm:p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg sm:text-xl font-semibold">톤수</div>
                            <input
                                placeholder="톤수를 입력해 주세요."
                                className="shadow-md text-lg sm:text-xl border-2 border-[#2E7D32] rounded-xl p-2 sm:p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg sm:text-xl font-semibold">기타사항</div>
                            <textarea
                                placeholder="기타사항을 입력해 주세요."
                                className="shadow-md text-lg sm:text-xl border-2 border-[#2E7D32] rounded-xl p-2 sm:p-5 h-[150px] sm:h-[200px]"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="text-lg sm:text-xl font-semibold">카테고리</div>

                            {/* 선택된 항목 */}
                            <div className="shadow-md text-xl p-5 border border-2 border-[#2E7D32] rounded-xl flex gap-2 flex-wrap">
                                {selected.length === 0 && (
                                    <span className="text-gray-400 text-lg sm:text-xl ">카테고리를 선택해 주세요.</span>
                                )}
                                {selected.map((item) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => handleRemove(item)}
                                        className="cursor-pointer bg-[rgba(46,125,50,0.75)] text-white p-3 rounded-full flex items-center gap-2 min-w-[100px] shadow-md"
                                    >
                                        <button className="text-lg sm:text-xl">x</button>
                                        <span className="text-lg sm:text-xl justify-center flex min-w-[50px] ">
                                            {item}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* 선택 가능한 버튼들 */}
                            <div className="flex gap-4 flex-wrap">
                                {categories
                                    .filter((cat) => !selected.includes(cat))
                                    .map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleSelect(cat)}
                                            className="shadow-md bg-[rgba(46,125,50,0.75)] text-white p-3 rounded-full flex items-center gap-2 cursor-pointer min-w-[100px] justify-center text-lg sm:text-xl transition-all duration-300 hover:scale-105"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* 이후 수정 필요 */}
                    <div className="flex justify-end">
                        <ShortButton onClick={handleSubmit} className="bg-[#2E7D32] text-white">
                            상담하기
                        </ShortButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
