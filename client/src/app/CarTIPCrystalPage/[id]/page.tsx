// app/CarTIPCrystalPage/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import WritingCrystal from "@/components/WritingCrystal";
import { dummyData } from "@/data/dummy";

export default function CarTIPCrystalPage() {
    const { id } = useParams();
    const post = dummyData.find((item) => String(item.id) === String(id));

    return <WritingCrystal post={post} />;
}
