import { create } from "zustand";
import { FilterTagState } from "./Filter.types";

export const useFilterTagStore = create<FilterTagState>((set) => ({
    draft: {
        manufacturer: "",
        models: [],
        grades: [],
    },

    setDraftManufacturer: (manufacturer, skipReset = false) =>
        set((state) => ({
            draft: {
                manufacturer,
                models: skipReset ? state.draft.models : [],
                grades: skipReset ? state.draft.grades : [], // 💡 manufacturer 바꾸면 등급도 초기화
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
                    grades: skipReset ? state.draft.grades : [], // 모델 바꾸면 등급도 초기화
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
                    grades: skipReset ? state.draft.grades : [], // 세부모델 바꿀 때 등급 초기화
                },
            };
        }),

    setDraftGrade: (grade: string) =>
        set((state) => {
            const exists = state.draft.grades.includes(grade);
            const newGrades = exists
                ? state.draft.grades.filter((g) => g !== grade) // 체크 해제
                : [...state.draft.grades, grade]; // 체크 추가

            return {
                draft: {
                    ...state.draft,
                    grades: newGrades,
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
