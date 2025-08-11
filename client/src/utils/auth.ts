// utils/auth.ts
export function getClientToken(): string | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("access_token") || localStorage.getItem("accessToken") || null;
    if (!raw || raw === "null" || raw === "undefined") return null;
    // 혹시 따옴표로 감싸져 저장된 경우 제거
    return raw.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
}
