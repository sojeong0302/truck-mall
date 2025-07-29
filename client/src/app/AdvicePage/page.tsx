"use client";

import ShortButton from "@/components/ShortButton";
import { useRouter } from "next/navigation";

export default function AdvicePage() {
    const router = useRouter();
    return (
        <div className="w-[100%] flex flex-col items-center gap-10 p-10">
            {/* 개인정보 수집 */}
            <div className="w-[70%] flex flex-col gap-3">
                <div className="text-4xl">문의: 010-8191-8244</div>
                <div className=" text-base w-full bg-white border-4 border-[#2E7D32] p-4 rounded-sm overflow-auto max-h-[200px]">
                    <pre className="whitespace-pre-wrap font-sans text-lg">
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
                        required
                        className="w-5 h-5 accent-[#2E7D32] transition transform duration-200 hover:scale-110 active:scale-95" // 체크 색상 커스터마이징
                    />
                    <div> 개인정보 수집 및 이용에 동의합니다.</div>
                </div>
            </div>

            {/* 상담지 */}
            <div className="w-[70%] border-4 border-[#2E7D32] rounded-4xl">
                <div className="w-[100%] flex justify-between p-10 flex bg-[rgba(46,125,50,0.25)] rounded-t-3xl">
                    <div className="flex flex-col gap-3 justify-center">
                        <div className="text-4xl font-bold">상담하기</div>
                        <div className="flex gap-1">
                            <div className="text-2xl text-[#D7263D]">*</div>
                            <div className="text-xl">표시된 항목은 필수 입력사항 입니다.</div>
                        </div>
                    </div>
                    <div className="w-[20%] flex flex-col justify-center gap-3">
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
                                {["2", "0", "2", "5", "/", "0", "7", "/", "2", "4"].map((char, idx) => (
                                    <span key={idx}>{char}</span>
                                ))}
                            </div>
                        </div>
                        {/* <div className="w-[100%] flex gap-2 items-center">
                            <div className="flex justify-center w-[50%] text-lg">담당자: </div>
                            <div className="w-[30%] p-2 text-[#6B6B6B] rounded-md">
                                <div className="flex justify-between text-base">
                                    <div>김</div>
                                    <div>달</div>
                                    <div>영</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[100%] flex gap-2 items-center">
                            <div className="flex justify-center w-[50%] text-lg">날 짜: </div>
                            <div className="w-[30%] p-2 text-[#6B6B6B] rounded-md">
                                <div className="flex justify-between text-base">
                                    {["2", "0", "2", "5", "/", "0", "7", "/", "2", "4"].map((char, idx) => (
                                        <span key={idx}>{char}</span>
                                    ))}
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="w-[100%] flex flex-col bg-white p-15 gap-10 rounded-b-4xl shadow-lg">
                    <div className="w-[100%] flex flex-col gap-10">
                        <div className="w-[100%] flex flex-col gap-1">
                            <div className="flex gap-1">
                                <div className="text-xl">성함</div>
                                <div className="text-2xl text-[#D7263D]">*</div>
                            </div>
                            <input
                                placeholder="성함을 입력해 주세요."
                                className="w-[50%] shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-1 ">
                                <div className="text-xl ">전화번호</div>
                                <div className="text-[#D7263D] text-2xl">*</div>
                            </div>
                            <input
                                type="tel"
                                placeholder="예: 01012345678"
                                className="w-[50%] shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xl">차량명</div>
                            <input
                                placeholder="차량명을 입력해 주세요."
                                className="shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xl">톤수</div>
                            <input
                                placeholder="톤수를 입력해 주세요."
                                className="shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xl">기타사항</div>
                            <input
                                placeholder="기타사항을 입력해 주세요."
                                className="shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-5"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xl">카테고리</div>
                            <input className="shadow-md text-xl border-2 border-[#2E7D32] rounded-xl p-5" />
                        </div>
                    </div>
                    {/* 이후 수정 필요 */}
                    <div className="flex justify-end">
                        <ShortButton onClick={() => router.back()} className="bg-[#2E7D32] text-white">
                            상담하기
                        </ShortButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
