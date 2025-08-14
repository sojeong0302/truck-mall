"use client";

import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { usePaginationStore } from "@/store/paginationStore";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CarTIPPage() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { currentPage } = usePaginationStore();
    const [carTIPs, setCarTIPs] = useState<any[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`${BASE_URL}/carTIP/list`);
                setCarTIPs(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("리뷰 불러오기 실패:", err);
            }
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
    const totalPages = Math.ceil(carTIPs.length / itemsPerPage);
    const pagedData = carTIPs.slice(startIndex, endIndex);

    return (
        <>
            <Bulletin uploadPath="CarTIPUploadPage" posts={pagedData} basePath="CarTIPDetailPage" />
            <Pagination totalPages={totalPages} />
        </>
    );
}
