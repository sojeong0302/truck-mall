import * as a from "./Header.style";

export default function Header() {
    return (
        <a.HeaderContainer>
            <a.LogoContainer>
                <a.LogoImage src="/images/logo.png" alt="로고" />
                <a.LoginTxtContainer>
                    <a.LogoTxt1>화물차 / 특장차 매매 전문 새마을 트럭</a.LogoTxt1>
                    <a.LogoTxt2>
                        10년간에 도길 프리미엄 브랜드 재직경험을 바탕으로 진정성 넘치는 판매를 추구 합니다.
                    </a.LogoTxt2>
                </a.LoginTxtContainer>
            </a.LogoContainer>
            <a.AuthContainer>
                <a.Home>홈</a.Home>|<a.Login>로그인</a.Login>
            </a.AuthContainer>
        </a.HeaderContainer>
    );
}
