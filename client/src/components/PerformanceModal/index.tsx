"use client";

export default function PerformanceModal() {
    console.log("[PerformanceModal] render");
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,.4)",
                zIndex: 9999,
            }}
        >
            <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>모달입니당</div>
        </div>
    );
}
