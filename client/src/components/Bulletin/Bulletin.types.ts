export interface BulletinProps {
    id: number;
    title: string;
    content: string;
    date: string;
    views: number;
}

export interface BulletinComponentProps {
    posts: BulletinProps[];
}
