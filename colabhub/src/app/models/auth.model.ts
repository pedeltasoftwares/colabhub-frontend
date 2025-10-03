export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface User{
    id: number,
    username: string;
    role: string;
    full_name: string;
}
