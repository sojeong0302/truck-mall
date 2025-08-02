"use client";

import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { dummyData2 } from "@/data/dummy";

const ITEMS_PER_PAGE = 10;

export default function ReviewPage() {
    const { currentPage } = usePaginationStore();
    const { isLoggedIn } = useAuthStore();

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedData = dummyData2.slice(startIndex, endIndex);
    const totalPages = Math.ceil(dummyData2.length / ITEMS_PER_PAGE);

    return (
        <div className="w-full">
            {isLoggedIn && (
                <div className="flex w-[80%] justify-end gap-2 p-4 text-sm">
                    <div>등록하기</div>
                </div>
            )}
            <Bulletin posts={dummyData2} basePath="ReviewDetailPage" />
            <Pagination totalPages={totalPages} />
        </div>
    );
}
