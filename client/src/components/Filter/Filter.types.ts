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
    setDraftManufacturer: (manufacturer: string, skipReset?: boolean) => void;
    setDraftModel: (model: string, skipReset?: boolean) => void;
    setDraftSubModel: (subModel: string, skipReset?: boolean) => void;
    setDraftGrade: (grade: string, skipReset?: boolean) => void;
    clear: () => void;
}
