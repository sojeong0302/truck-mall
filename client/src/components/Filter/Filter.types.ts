import { create } from "zustand";
import { useSimpleTagStore } from "@/store/simpleTagStore";

interface GradeData {
    name: string;
    grades: string[];
}
interface ModelData {
    name: string;
    subModels: GradeData[];
}
interface Tags {
    manufacturer: string;
    models: ModelData[];
}

interface FilterTagState {
    // 적용 상태(쿼리에 쓰는 값)
    tags: Tags;
    // 선택 중 상태(검색 누르기 전)
    draft: Tags;

    // draft 전용 setters
    setDraftManufacturer: (manufacturer: string, skipReset?: boolean) => void;
    setDraftModel: (model: string, skipReset?: boolean) => void;
    setDraftSubModel: (subModel: string, skipReset?: boolean) => void;
    setDraftGrade: (grade: string, skipReset?: boolean) => void;

    // 적용/초기화
    applyDraft: () => void; // 검색 클릭 시 호출
    clearDraft: () => void;
    clear: () => void; // applied 초기화
    clearAll: () => void; // draft+applied 모두 초기화
}

const empty: Tags = { manufacturer: "", models: [] };

export const useFilterTagStore = create<FilterTagState>((set, get) => ({
    tags: empty,
    draft: empty,

    setDraftManufacturer: (manufacturer, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        set({ draft: { manufacturer, models: [] } });
    },

    setDraftModel: (model, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const d = get().draft;
        set({ draft: { ...d, models: [{ name: model, subModels: [] }] } });
    },

    setDraftSubModel: (subModel, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const d = get().draft;
        if (!d.models.length) return;
        const updated = [...d.models];
        updated[0] = { ...updated[0], subModels: [{ name: subModel, grades: [] }] };
        set({ draft: { ...d, models: updated } });
    },

    setDraftGrade: (grade, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const d = get().draft;
        if (!d.models.length || !d.models[0].subModels.length) return;
        const updated = [...d.models];
        updated[0].subModels[0] = { ...updated[0].subModels[0], grades: [grade] };
        set({ draft: { ...d, models: updated } });
    },

    applyDraft: () => set((s) => ({ tags: s.draft })), // ✅ 검색 시 적용
    clearDraft: () => set({ draft: empty }),
    clear: () => set({ tags: empty }),
    clearAll: () => set({ tags: empty, draft: empty }),
}));
