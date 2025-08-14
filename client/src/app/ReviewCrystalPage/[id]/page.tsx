"use client";

import { useParams } from "next/navigation";
import WritingCrystal from "@/components/WritingCrystal";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ReviewCrystalPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { id } = useParams();
    const [post, setPost] = useState<any | null>(null);

    useEffect(() => {
        const fetchReview = async () => {
            const res = await api.get(`${BASE_URL}/review/${id}`);
            setPost(res.data);
        };
        fetchReview();
    }, [id]);

    if (!post) return <div className="p-10">로딩 중...</div>;

    return <WritingCrystal url="ReviewPage" post={post} />;
}
