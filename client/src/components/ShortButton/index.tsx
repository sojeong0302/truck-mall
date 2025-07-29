"use client";
interface ShortButtonProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export default function ShortButton({ className, children, onClick }: ShortButtonProps) {
    return (
        <div
            onClick={onClick}
            className={`w-fit cursor-pointer p-2 rounded-md font-medium transition transform duration-200 hover:scale-110 active:scale-95 ${className}`}
        >
            {children}
        </div>
    );
}
