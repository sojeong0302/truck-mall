export interface BulletinProps {
    id: number;
    title: string;
    content: string;
    date: string;
    view: number;
    images?: string[];
}

export interface BulletinComponentProps {
    posts: BulletinProps[];
    basePath: string;
    uploadPath: string;
}
