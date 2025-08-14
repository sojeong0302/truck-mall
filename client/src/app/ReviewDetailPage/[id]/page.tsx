"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import WritingDetail from "@/components/WritingDetail";
import { api } from "@/lib/api";

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string | null>(null);
    const hasFetchedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const unwrapParams = async () => {
            const { id } = await params;
            setId(id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!id || hasFetchedRef.current) return;

        const fetchPost = async () => {
            try {
                const res = await api.get(`${BASE_URL}/review/${id}`);
                setPost(res.data);
                hasFetchedRef.current = true;

                await api.post(`${BASE_URL}/review/${id}/view`);
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

    return <WritingDetail deletePath="review" url="/ReviewPage" id={id!} crystalPath="ReviewCrystalPage" post={post} />;
}
