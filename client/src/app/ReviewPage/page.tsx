"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import { api } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

export default function ReviewPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { currentPage } = usePaginationStore();
    const [reviews, setReviews] = useState<any[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`${BASE_URL}/review/list`);
                setReviews(res.data);
            } catch (err) {}
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(reviews.length / itemsPerPage);
    const pagedData = reviews.slice(startIndex, endIndex);

    return (
        <>
            <Bulletin uploadPath="ReviewUploadPage" posts={pagedData} basePath="ReviewDetailPage" />
            <Pagination totalPages={totalPages} />
        </>
    );
}
