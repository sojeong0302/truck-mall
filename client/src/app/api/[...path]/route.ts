// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://3.107.49.131"; // EC2 주소

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const url = `${BACKEND}/${params.path.join("/")}${req.nextUrl.search}`;
    const res = await fetch(url, { method: "GET" });
    const data = await res.arrayBuffer();
    return new NextResponse(data, { status: res.status, headers: res.headers });
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const url = `${BACKEND}/${params.path.join("/")}${req.nextUrl.search}`;
    const body = await req.arrayBuffer();
    const res = await fetch(url, { method: "POST", body, headers: req.headers });
    const data = await res.arrayBuffer();
    return new NextResponse(data, { status: res.status, headers: res.headers });
}
