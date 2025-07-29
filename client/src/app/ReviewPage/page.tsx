"use client";

import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import { dummyData2 } from "@/data/dummy";

const ITEMS_PER_PAGE = 10;

export default function ReviewPage() {
    const { currentPage } = usePaginationStore();

    // 현재 페이지에 맞게 데이터 자르기
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedData = dummyData2.slice(startIndex, endIndex);

    const totalPages = Math.ceil(dummyData2.length / ITEMS_PER_PAGE);

    return (
        <>
            <Bulletin posts={dummyData2} basePath="ReviewDetailPage" />
            <Pagination totalPages={totalPages} />
        </>
    );
}
