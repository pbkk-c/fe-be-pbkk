interface LoginType {
    email: string;
    password: string;
}

interface RegisterType {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}
export type { LoginType, RegisterType };