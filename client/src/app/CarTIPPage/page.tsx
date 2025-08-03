"use client";

import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import axios from "axios";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function CarTIPPage() {
    const { currentPage } = usePaginationStore();
    const [carTIPs, setCarTIPs] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("http://localhost:5000/carTIP/list");
                setCarTIPs(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("리뷰 불러오기 실패:", err);
            }
        };

        fetchReviews();
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const totalPages = Math.ceil(carTIPs.length / ITEMS_PER_PAGE);
    const pagedData = carTIPs.slice(startIndex, endIndex);

    return (
        <>
            <Bulletin uploadPath="CarTIPUploadPage" posts={pagedData} basePath="CarTIPDetailPage" />
            <Pagination totalPages={totalPages} />
        </>
    );
}
