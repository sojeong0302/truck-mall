"use client";
import * as a from "./Header.style";
import { useAuthToggle } from "./Header.hooks";
import { useRouter } from "next/navigation";

export default function Header() {
    const { isLoggedIn, toggleAuth } = useAuthToggle();
    const router = useRouter();
    return (
        <>
            <a.AuthContainer>
                <a.Home onClick={() => router.push("/")}>홈</a.Home>|
                <a.Login onClick={toggleAuth}>{isLoggedIn ? "로그아웃" : "로그인"}</a.Login>
            </a.AuthContainer>
            <a.HeaderContainer>
                <a.LogoContainer>
                    <a.LogoImage src="/images/logo.png" alt="로고" />
                    <a.LoginTxtContainer onClick={() => router.push("/")}>
                        <a.LogoTxt1>화물차 / 특장차 매매 전문 새마을 트럭</a.LogoTxt1>
                        <a.LogoTxt2>
                            10년간에 도길 프리미엄 브랜드 재직경험을 바탕으로 진정성 넘치는 판매를 추구 합니다.
                        </a.LogoTxt2>
                    </a.LoginTxtContainer>
                </a.LogoContainer>
            </a.HeaderContainer>
        </>
    );
}
