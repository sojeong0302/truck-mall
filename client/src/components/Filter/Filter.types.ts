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
    // 적용 상태(조회에 쓰는 값)
    tags: Tags;
    // 임시 선택 상태(검색 누르기 전)
    draft: Tags;

    // ✅ 새 API: draft 전용 setters (검색 버튼 눌러야 적용)
    setDraftManufacturer: (manufacturer: string, skipReset?: boolean) => void;
    setDraftModel: (model: string, skipReset?: boolean) => void;
    setDraftSubModel: (subModel: string, skipReset?: boolean) => void;
    setDraftGrade: (grade: string, skipReset?: boolean) => void;

    applyDraft: () => void; // 검색 클릭 시 draft → tags
    clearDraft: () => void; // draft만 초기화
    clear: () => void; // applied만 초기화
    clearAll: () => void; // draft+applied 모두 초기화

    // ✅ 레거시 호환 API: 즉시 적용(set*). 업로드/수정 페이지에서 사용 중
    setManufacturer: (manufacturer: string, skipReset?: boolean) => void;
    setModel: (model: string, skipReset?: boolean) => void;
    setSubModel: (subModel: string, skipReset?: boolean) => void;
    setGrade: (grade: string, skipReset?: boolean) => void;
}

const empty: Tags = { manufacturer: "", models: [] };

export const useFilterTagStore = create<FilterTagState>((set, get) => ({
    tags: empty,
    draft: empty,

    // --------- draft setters (검색 눌러야 적용) ---------
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

    applyDraft: () => set((s) => ({ tags: s.draft })),
    clearDraft: () => set({ draft: empty }),
    clear: () => set({ tags: empty }),
    clearAll: () => set({ tags: empty, draft: empty }),

    // --------- 레거시 호환 setters (즉시 적용: draft+tags 동시 갱신) ---------
    setManufacturer: (manufacturer, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const next: Tags = { manufacturer, models: [] };
        set({ draft: next, tags: next });
    },

    setModel: (model, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const d = get().draft;
        const next: Tags = { ...d, models: [{ name: model, subModels: [] }] };
        set({ draft: next, tags: next });
    },

    setSubModel: (subModel, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const d = get().draft;
        if (!d.models.length) return;
        const updated = [...d.models];
        updated[0] = { ...updated[0], subModels: [{ name: subModel, grades: [] }] };
        const next: Tags = { ...d, models: updated };
        set({ draft: next, tags: next });
    },

    setGrade: (grade, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const d = get().draft;
        if (!d.models.length || !d.models[0].subModels.length) return;
        const updated = [...d.models];
        updated[0].subModels[0] = { ...updated[0].subModels[0], grades: [grade] };
        const next: Tags = { ...d, models: updated };
        set({ draft: next, tags: next });
    },
}));
