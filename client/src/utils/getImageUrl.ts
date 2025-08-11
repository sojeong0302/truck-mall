// utils/getImageUrl.ts
export const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};
