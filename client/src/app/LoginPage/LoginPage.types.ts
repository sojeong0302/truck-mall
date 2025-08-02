import { create } from "zustand";

interface LoginPageProp {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
}

export const LoginPagePropStore = create<LoginPageProp>((set) => ({
    username: "",
    setUsername: (value) => set({ username: value }),
    password: "",
    setPassword: (value) => set({ password: value }),
}));
