"use client";

import { Suspense } from "react";
import LoginContent from "./LoginContent"; // 분리 안 했다면 아래처럼 같은 파일에 작성해도 됨

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    );
}
