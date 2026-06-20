import { create } from "zustand";

const useAuthStore = create((set) => ({
    authName: "",
    updateAuthName: (name) => set({ authName: name }),
}));

export default useAuthStore;