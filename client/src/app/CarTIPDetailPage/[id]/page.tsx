"use client";

import { use } from "react";
import WritingDetail from "@/components/WritingDetail";
import { useEffect, useRef, useState } from "react";

export default function CarTIPDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // ✅ use()로 언래핑

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!id || hasFetchedRef.current) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/carTIP/${id}`);
                const data = await res.json();
                setPost(data);
                hasFetchedRef.current = true;

                await fetch(`http://localhost:5000/carTIP/${id}/view`, {
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

    return <WritingDetail url="/CarTIPPage" id={id} crystalPath="CarTIPCrystalPage" post={post} />;
}
