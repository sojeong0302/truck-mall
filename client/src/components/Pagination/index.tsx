"use client";

import { usePaginationStore } from "@/store/paginationStore";
import { usePagination } from "./Pagination.hooks";
import { PaginationProps } from "./Pagination.types";

export default function Pagination({ totalPages }: PaginationProps) {
    const { currentPage, setPage } = usePaginationStore();
    const pages = usePagination(totalPages);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            {/* Prev button */}
            <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
                &lt;
            </button>

            {/* Page numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => setPage(page)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                        currentPage === page
                            ? "bg-green-700 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
                &gt;
            </button>
        </div>
    );
}
