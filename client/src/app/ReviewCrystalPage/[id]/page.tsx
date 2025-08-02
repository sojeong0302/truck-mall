"use client";

import { useParams } from "next/navigation";
import WritingCrystal from "@/components/WritingCrystal";
import { dummyData2 } from "@/data/dummy";

export default function ReviewCrystalPage() {
    const { id } = useParams();
    const post = dummyData2.find((item) => String(item.id) === String(id));

    return <WritingCrystal url="/ReviewPage" post={post} />;
}
