"use client";

import { use } from "react";
import { dummyData3 } from "@/data/dummy";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const post = dummyData3.find((item) => item.id === Number(id));

    return <>매물 상세 페이지입니다.</>;
}
