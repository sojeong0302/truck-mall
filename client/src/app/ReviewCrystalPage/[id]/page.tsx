"use client";

import { useParams } from "next/navigation";
import WritingCrystal from "@/components/WritingCrystal";
import { dummyData2 } from "@/data/dummy";
import { useEffect } from "react";
import { useWritingCrystalPropsStore } from "@/components/WritingCrystal/WritingCrystal.types";

export default function ReviewCrystalPage() {
    const { id } = useParams();
    const post = dummyData2.find((item) => String(item.id) === String(id));

    const { setTitle, setContent } = useWritingCrystalPropsStore();

    // ✅ Zustand에 post 값 주입
    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post, setTitle, setContent]);

    return <WritingCrystal url="/ReviewPage" post={post} />;
}
