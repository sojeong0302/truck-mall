"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WritingDetail from "@/components/WritingDetail";

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = use(params);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/review/${id}`);
                const data = await res.json();
                setPost(data);
            } catch (error) {
                console.error("리뷰 조회 실패", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="p-10 text-gray-500">불러오는 중...</div>;
    if (!post) return <div className="p-10 text-red-500">해당 글을 찾을 수 없습니다.</div>;

    return <WritingDetail id={id} crystalPath="ReviewCrystalPage" post={post} />;
}
