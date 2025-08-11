const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path; // 이미 절대경로면 그대로
    return `${BASE_URL}${path}`;
};
