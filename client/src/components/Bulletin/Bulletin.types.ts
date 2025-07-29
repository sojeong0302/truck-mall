export interface BulletinProps {
    id: number;
    title: string;
    content: string;
    date: string;
    views: number;
    images?: string[];
}

export interface BulletinComponentProps {
    posts: BulletinProps[];
    basePath: string;
}
