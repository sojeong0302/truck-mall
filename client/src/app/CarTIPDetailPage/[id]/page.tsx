"use client";

import { use } from "react";
import WritingDetail from "@/components/WritingDetail";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

export default function CarTIPDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!id || hasFetchedRef.current) return;

        const fetchPost = async () => {
            try {
                const res = await api.get(`${BASE_URL}/carTIP/${id}`);
                setPost(res.data);
                hasFetchedRef.current = true;

                await fetch(`${BASE_URL}/carTIP/${id}/view`, {
                    method: "POST",
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchPost();
    }, [id]);

    if (!post) return <div className="p-10 text-red-500">해당 글을 찾을 수 없습니다.</div>;

    return <WritingDetail url="/CarTIPPage" id={id} deletePath="carTIP" crystalPath="CarTIPCrystalPage" post={post} />;
}
