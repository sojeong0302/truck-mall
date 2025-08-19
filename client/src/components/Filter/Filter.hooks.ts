import { create } from "zustand";
import { FilterTagState } from "./Filter.types";

export const useFilterTagStore = create<FilterTagState>((set) => ({
    draft: {
        manufacturer: "",
        models: [],
        grades: [],
    },

    setDraftManufacturer: (manufacturer, skipReset = false) =>
        set(() => ({
            draft: {
                manufacturer,
                models: [], // ✅ 완전 초기화
                grades: [], // 선택 사항
            },
        })),

    setDraftModel: (model, skipReset = false) =>
        set((state) => ({
            draft: {
                ...state.draft, // ✅ manufacturer 유지
                models: [
                    {
                        name: model,
                        subModels: [],
                    },
                ],
            },
        })),

    setDraftSubModel: (subModel, skipReset = false) =>
        set((state) => {
            const model = state.draft.models[0];
            if (!model) return state;

            const updatedModel = {
                ...model,
                subModels: [
                    {
                        name: subModel,
                        grades: [], // ✅ grade 초기화
                    },
                ],
            };

            return {
                draft: {
                    ...state.draft,
                    models: [updatedModel],
                    grades: [], // 선택 사항
                },
            };
        }),

    setDraftGrade: (grades, skipReset = false) =>
        set((state) => {
            const models = state.draft.models.map((model) => {
                return {
                    ...model,
                    subModels: model.subModels.map((subModel) => {
                        const isCurrent =
                            model.name === state.draft.models[0]?.name && subModel.name === model.subModels[0]?.name;

                        return isCurrent ? { ...subModel, grades } : subModel;
                    }),
                };
            });

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
                grades: [],
            },
        })),
}));
