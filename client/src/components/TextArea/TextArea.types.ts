export interface TextAreaProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setContent?: (value: string) => void;
}
