"use client";

import Pagination from "@/components/Pagination";
import Bulletin from "@/components/Bulletin";
import { BulletinProps } from "@/components/Bulletin/Bulletin.types";
import { usePaginationStore } from "@/store/paginationStore";

const dummyData: BulletinProps[] = [
    {
        id: 1,
        title: "차량, 후측면 유리의 유막 제거 및 관리",
        content: "매서운 호우가 지나가고 연일 계속",
        date: "2025 / 07 / 24",
        views: 10,
    },
    {
        id: 2,
        title: "타이어 관리 요령",
        content: "고속도로 주행 전 반드시 확인해야 할 점검 항목",
        date: "2025 / 07 / 25",
        views: 25,
    },
    {
        id: 3,
        title: "엔진오일 교환 주기와 체크 방법",
        content: "장거리 운행 시 꼭 확인하세요.",
        date: "2025 / 07 / 26",
        views: 14,
    },
    {
        id: 4,
        title: "차량, 후측면 유리의 유막 제거 및 관리",
        content: "매서운 호우가 지나가고 연일 계속",
        date: "2025 / 07 / 24",
        views: 10,
    },
    {
        id: 5,
        title: "타이어 관리 요령",
        content: "고속도로 주행 전 반드시 확인해야 할 점검 항목",
        date: "2025 / 07 / 25",
        views: 25,
    },
    {
        id: 6,
        title: "엔진오일 교환 주기와 체크 방법",
        content: "장거리 운행 시 꼭 확인하세요.",
        date: "2025 / 07 / 26",
        views: 14,
    },
    {
        id: 7,
        title: "타이어 관리 요령",
        content: "고속도로 주행 전 반드시 확인해야 할 점검 항목",
        date: "2025 / 07 / 25",
        views: 25,
    },
    {
        id: 8,
        title: "엔진오일 교환 주기와 체크 방법",
        content: "장거리 운행 시 꼭 확인하세요.",
        date: "2025 / 07 / 26",
        views: 14,
    },
    {
        id: 9,
        title: "타이어 관리 요령",
        content: "고속도로 주행 전 반드시 확인해야 할 점검 항목",
        date: "2025 / 07 / 25",
        views: 25,
    },
    {
        id: 10,
        title: "엔진오일 교환 주기와 체크 방법",
        content: "장거리 운행 시 꼭 확인하세요.",
        date: "2025 / 07 / 26",
        views: 14,
    },
    {
        id: 11,
        title: "타이어 관리 요령",
        content: "고속도로 주행 전 반드시 확인해야 할 점검 항목",
        date: "2025 / 07 / 25",
        views: 25,
    },
    {
        id: 12,
        title: "엔진오일 교환 주기와 체크 방법",
        content: "장거리 운행 시 꼭 확인하세요.",
        date: "2025 / 07 / 26",
        views: 14,
    },
];

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
            <Bulletin posts={pagedData} />
            <Pagination totalPages={totalPages} />
        </>
    );
}
