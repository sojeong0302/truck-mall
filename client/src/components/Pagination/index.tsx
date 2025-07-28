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
                className="w-9 h-9 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
                &lt;
            </button>

            {/* Page numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => setPage(page)}
                    style={currentPage === page ? { backgroundColor: "rgba(46,125,50,0.5)" } : undefined}
                    className={`px-3 py-1 rounded-full transition-transform transition-colors duration-150 ease-in-out active:scale-95 ${
                        currentPage === page ? "text-white" : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
                &gt;
            </button>
        </div>
    );
}
