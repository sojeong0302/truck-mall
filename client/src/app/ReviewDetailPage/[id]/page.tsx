"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import WritingDetail from "@/components/WritingDetail";

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string | null>(null);
    const hasFetchedRef = useRef(false);
    const router = useRouter();

    // ✅ params 언래핑
    useEffect(() => {
        const unwrapParams = async () => {
            const { id } = await params;
            setId(id);
        };
        unwrapParams();
    }, [params]);

    // ✅ 글 가져오기
    useEffect(() => {
        if (!id || hasFetchedRef.current) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/review/${id}`);
                const data = await res.json();
                setPost(data);
                hasFetchedRef.current = true;

                // ✅ 조회수 증가
                await fetch(`http://localhost:5000/review/${id}/view`, {
                    method: "POST",
                });
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

    return <WritingDetail id={id!} crystalPath="ReviewCrystalPage" post={post} />;
}
