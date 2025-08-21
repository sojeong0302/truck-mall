export interface FilterTagState {
    draft: {
        manufacturer: string;
        models: {
            name: string;
            subModels: {
                name: string;
                grades: string[];
            }[];
        }[];
        grades: string[];
    };

    // ✅ 적용된 상태(실제 검색에 사용)
    applied: {
        manufacturer: string;
        models: {
            name: string;
            subModels: {
                name: string;
                grades: string[];
            }[];
        }[];
        grades: string[];
    };

    // draft 조작
    setDraftManufacturer: (manufacturer: string, skipReset?: boolean) => void;
    setDraftModel: (model: string, skipReset?: boolean) => void;
    setDraftSubModel: (subModel: string, skipReset?: boolean) => void;
    setDraftGrade: (grades: string[], skipReset?: boolean) => void;

    // 초기화 계열
    clear: () => void; // draft만 초기화
    applyDraft: () => void; // ✅ draft -> applied 반영
    clearAll: () => void; // ✅ draft/applied 모두 초기화
}
