"use client";
import { ShortButtonProps } from "./ShortButton.types";

export default function ShortButton({ className, children, onClick }: ShortButtonProps) {
    return (
        <div
            onClick={onClick}
            className={`flex justify-center shadow-lg text-2xl  w-[120px] cursor-pointer p-2.5 rounded-md font-medium transition transform duration-200 hover:scale-110 active:scale-95 ${className}`}
        >
            {children}
        </div>
    );
}
