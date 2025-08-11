// utils/getImageUrl.ts
export const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path; // 이미 절대 경로면 그대로 반환

    // ✅ 백엔드 URL + 상대 경로
    return `https://www.saemaeultruck.pics${path}`;
};
