// EtcPoto.types.ts
export interface EtcPotoProps {
    initialImages?: string[]; // 서버에서 받은 기존 이미지 URL
    onChange?: (files: File[], keepImages: string[]) => void;
}
