"use client";

import { WritingDetailProps } from "./WritingDetail.types";
import { dummyData } from "@/data/dummy";
import { BulletinProps } from "@/components/Bulletin/Bulletin.types";

export default function WritingDetail({ id }: WritingDetailProps) {
    const post: BulletinProps | undefined = dummyData.find((item: BulletinProps) => item.id === Number(id));
    if (!post) {
        return <div className="p-10 text-red-600">해당 글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="text-gray-600 text-sm">작성일: {post.date}</div>
            <div className="text-lg">{post.content}</div>
            <div className="text-sm text-gray-500">조회수: {post.views}</div>
        </div>
    );
}
