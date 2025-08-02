"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

export default function ReviewPage() {
    const { currentPage } = usePaginationStore();
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("http://localhost:5000/review/list");
                setReviews(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("리뷰 불러오기 실패:", err);
            }
        };

        fetchReviews();
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
    const pagedData = reviews.slice(startIndex, endIndex);

    return (
        <>
            <Bulletin uploadPath="ReviewUploadPage" posts={pagedData} basePath="ReviewDetailPage" />
            <Pagination totalPages={totalPages} />
        </>
    );
}
