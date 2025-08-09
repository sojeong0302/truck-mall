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
    tags: Tags;
    setManufacturer: (manufacturer: string, skipReset?: boolean) => void;
    setModel: (model: string, skipReset?: boolean) => void;
    setSubModel: (subModel: string, skipReset?: boolean) => void;
    setGrade: (grade: string, skipReset?: boolean) => void;
    clear: () => void;
}

export const useFilterTagStore = create<FilterTagState>((set, get) => ({
    tags: {
        manufacturer: "",
        models: [],
    },

    setManufacturer: (manufacturer, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        set({ tags: { manufacturer, models: [] } });
    },

    setModel: (model, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const tags = get().tags;
        set({
            tags: {
                ...tags,
                models: [{ name: model, subModels: [] }],
            },
        });
    },

    setSubModel: (subModel, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const tags = get().tags;
        if (!tags.models.length) return;
        const updatedModels = [...tags.models];
        updatedModels[0] = { ...updatedModels[0], subModels: [{ name: subModel, grades: [] }] };
        set({ tags: { ...tags, models: updatedModels } });
    },

    setGrade: (grade, skipReset = false) => {
        if (!skipReset) useSimpleTagStore.getState().resetSimpleTag();
        const tags = get().tags;
        if (!tags.models.length || !tags.models[0].subModels.length) return;
        const updatedModels = [...tags.models];
        updatedModels[0].subModels[0] = { ...updatedModels[0].subModels[0], grades: [grade] };
        set({ tags: { ...tags, models: updatedModels } });
    },

    clear: () => set({ tags: { manufacturer: "", models: [] } }),
}));
