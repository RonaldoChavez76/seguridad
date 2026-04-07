export class User {
    id: number;
    name: string;
    lastname: string;
    username: string;
    password?: string;
    hash?: string | null;
    created_at: Date;
}