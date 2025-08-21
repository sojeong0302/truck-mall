// src/components/Filter/Filter.hooks.ts
"use client";

import { create } from "zustand";
import { FilterTagState } from "./Filter.types";

type Model = {
    name: string;
    subModels: { name: string; grades: string[] }[];
};

const initialDraft = (): FilterTagState["draft"] => ({
    manufacturer: "",
    models: [],
    grades: [],
});

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const useFilterTagStore = create<FilterTagState>((set, get) => ({
    // UI에서 편집 중인 값
    draft: initialDraft(),

    // 실제 검색에 사용하는 확정 값
    applied: initialDraft(),

    // 제조사 변경 시 하위 선택 초기화
    setDraftManufacturer: (manufacturer, _skipReset = false) =>
        set(() => ({
            draft: {
                manufacturer,
                models: [],
                grades: [],
            },
        })),

    // 모델 선택(제조사 유지, 모델만 세팅)
    setDraftModel: (model, _skipReset = false) =>
        set((state) => ({
            draft: {
                ...state.draft,
                models: [{ name: model, subModels: [] }],
                // grades 는 subModel 선택 시 초기화하도록 정책 유지
            },
        })),

    // 서브모델 선택(해당 모델의 첫 subModel만 유지)
    setDraftSubModel: (subModel, _skipReset = false) =>
        set((state) => {
            const baseModel: Model | undefined = state.draft.models[0];
            if (!baseModel) {
                // 모델이 아직 없으면 무시
                return state;
            }
            const updatedModel: Model = {
                ...baseModel,
                subModels: [{ name: subModel, grades: [] }],
            };
            return {
                draft: {
                    ...state.draft,
                    models: [updatedModel],
                    grades: [], // 개별 grades 필드도 비우는 정책
                },
            };
        }),

    // 등급(grade) 선택(가장 첫 모델/서브모델에 적용)
    setDraftGrade: (grades, _skipReset = false) =>
        set((state) => {
            const models = state.draft.models.map((m, i) => ({
                ...m,
                subModels: m.subModels.map((s, j) => (i === 0 && j === 0 ? { ...s, grades } : s)),
            }));
            return {
                draft: {
                    ...state.draft,
                    models,
                    grades, // 편의상 상위에도 보관
                },
            };
        }),

    // draft만 초기화
    clear: () => set(() => ({ draft: initialDraft() })),

    // draft -> applied 반영
    applyDraft: () =>
        set((state) => ({
            applied: clone(state.draft),
        })),

    // draft/applied 모두 초기화
    clearAll: () =>
        set(() => ({
            draft: initialDraft(),
            applied: initialDraft(),
        })),
}));
