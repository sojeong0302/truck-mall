import WritingDetail from "@/components/WritingDetail";
import { dummyData2 } from "@/data/dummy";

export default function CarTIPDetailPage({ params }: { params: { id: string } }) {
    const post = dummyData2.find((item) => item.id === Number(params.id));

    if (!post) {
        return <div className="p-10 text-red-500">해당 글을 찾을 수 없습니다.</div>;
    }

    return <WritingDetail post={post} />;
}
