import { create } from "zustand";
import { FilterTagState } from "./Filter.types";

export const useFilterTagStore = create<FilterTagState>((set) => ({
    draft: {
        manufacturer: "",
        models: [],
    },

    setDraftManufacturer: (manufacturer, skipReset = false) =>
        set((state) => ({
            draft: {
                manufacturer,
                models: skipReset ? state.draft.models : [],
            },
        })),

    setDraftModel: (model, skipReset = false) =>
        set((state) => {
            const models = state.draft.models.map((m) => {
                if (m.name === model) {
                    return {
                        ...m,
                        subModels: skipReset ? m.subModels : [],
                    };
                }
                return m;
            });

            const exists = models.find((m) => m.name === model);
            const newModel = {
                name: model,
                subModels: [],
            };

            return {
                draft: {
                    ...state.draft,
                    models: exists ? models : [...models, newModel],
                },
            };
        }),

    setDraftSubModel: (subModel, skipReset = false) =>
        set((state) => {
            const models = state.draft.models.map((m) => {
                const subExists = m.subModels.find((s) => s.name === subModel);
                const newSub = {
                    name: subModel,
                    grades: [],
                };

                return {
                    ...m,
                    subModels: subExists
                        ? m.subModels.map((s) =>
                              s.name === subModel ? { ...s, grades: skipReset ? s.grades : [] } : s
                          )
                        : [...m.subModels, newSub],
                };
            });

            return {
                draft: {
                    ...state.draft,
                    models,
                },
            };
        }),

    setDraftGrade: (grade, _skipReset = false) =>
        set((state) => {
            const models = state.draft.models.map((m) => ({
                ...m,
                subModels: m.subModels.map((s) => ({
                    ...s,
                    grades: [grade],
                })),
            }));

            return {
                draft: {
                    ...state.draft,
                    models,
                },
            };
        }),

    clear: () =>
        set(() => ({
            draft: {
                manufacturer: "",
                models: [],
            },
        })),
}));
