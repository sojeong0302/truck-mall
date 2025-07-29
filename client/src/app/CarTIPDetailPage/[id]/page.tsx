// src/app/CarTIPDetailPage/[id]/page.tsx

import WritingDetail from "@/components/WritingDetail";
import { dummyData } from "@/data/dummy";
import { BulletinProps } from "@/components/Bulletin/Bulletin.types";

export default function CarTIPDetailPage({ params }: { params: { id: string } }) {
    const post: BulletinProps | undefined = dummyData.find((item) => item.id === Number(params.id));

    if (!post) {
        return <div className="p-10 text-red-500">해당 글을 찾을 수 없습니다.</div>;
    }

    return <WritingDetail {...post} />;
}
