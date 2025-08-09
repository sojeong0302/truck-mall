export interface Post {
    id: number;
    title: string;
    content: string;
    images?: string[];
}

export interface WritingUploadProps {
    post?: Post;
    url?: string;
}
