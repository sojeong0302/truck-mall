"use client";

import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import { dummyData } from "@/data/dummy";

const ITEMS_PER_PAGE = 10;

export default function CarTIPPage() {
    const { currentPage } = usePaginationStore();

    // 현재 페이지에 맞게 데이터 자르기
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedData = dummyData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE);

    return (
        <>
            <Bulletin posts={pagedData} basePath="CarTIPDetailPage" />
            <Pagination totalPages={totalPages} />
        </>
    );
}
