import { create } from "zustand";
import { User } from "@/types/user";
import { Storage } from "expo-sqlite/kv-store";


interface UserStore {
    user: User | null;
    loggedIn: boolean;
    getUser: () => Promise<User | null>;
    saveUser: (user: User) => void;
    removeUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    loggedIn: false,

    getUser: async () => {
        const user = await Storage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user) as User;
            set({ user: parsedUser });
            set({ loggedIn: true });
            return parsedUser;
        } else {
            set({ user: null });
            set({ loggedIn: false });
            return null;
        }
    },

    saveUser: async (user: User) => {
        await Storage.setItem("user", JSON.stringify(user));
        set({ user });
        set({ loggedIn: true });
    },

    removeUser: async () => {
        await Storage.removeItem("user");
        set({ user: null });
        set({ loggedIn: false });
    }

}));