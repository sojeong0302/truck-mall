"use client";

import { use } from "react";
import { useEffect, useState, useRef } from "react";
import WritingDetail from "@/components/WritingDetail";
import { api } from "@/lib/api";

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const [post, setPost] = useState<any>(null);
    const { id } = use(params);
    const hasFetchedRef = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id || hasFetchedRef.current) return;

        hasFetchedRef.current = true;
        setLoading(true);

        (async () => {
            try {
                const res = await api.get(`${BASE_URL}/review/${id}`);
                setPost(res.data);
                fetch(`${BASE_URL}/review/${id}/view`, { method: "POST" }).catch(() => {});
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, BASE_URL]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div
                    className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin"
                    style={{ borderTopColor: "#2E7D32" }}
                />
            </div>
        );
    }

    if (!post) return <div className="p-10 text-red-500">해당 글을 찾을 수 없습니다.</div>;

    return <WritingDetail deletePath="review" url="/ReviewPage" id={id} crystalPath="ReviewCrystalPage" post={post} />;
}
