// EtcPoto.types.ts
export interface EtcPotoProps {
    initialImages?: string[];
    setImages?: (files: File[]) => void; // ✅ 여기 변경
}
