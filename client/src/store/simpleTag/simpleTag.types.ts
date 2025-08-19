// /store/simpleTag/simpleTag.types.ts

export interface SimpleTag {
    type: string;
    grade: string;
}

export interface SimpleTagState {
    simpleTag: SimpleTag | null;
    setSimpleTag: (type: string, grade: string, skipReset?: boolean) => void;
    resetSimpleTag: () => void;
}
