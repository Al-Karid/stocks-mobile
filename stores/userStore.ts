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

    // Get user from persistent storage
    getUser: async () => {
        try {
            const user = await Storage.getItem("user");
            if (user) {
                const parsedUser = JSON.parse(user) as User;
                set({ user: parsedUser, loggedIn: true });
                return parsedUser;
            } else {
                set({ user: null, loggedIn: false });
                return null;
            }
        } catch (error) {
            console.error("Error fetching user from storage", error);
            set({ user: null, loggedIn: false });
            return null;
        }
    },

    // Save user to persistent storage
    saveUser: async (user: User) => {
        try {
            await Storage.setItem("user", JSON.stringify(user));
            set({ user, loggedIn: true });
        } catch (error) {
            console.error("Error saving user to storage", error);
        }
    },

    // Remove user from persistent storage
    removeUser: async () => {
        try {
            await Storage.removeItem("user");
            set({ user: null, loggedIn: false });
        } catch (error) {
            console.error("Error removing user from storage", error);
        }
    }
}));
