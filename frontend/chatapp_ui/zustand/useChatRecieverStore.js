import {create} from "zustand";

const useChatRecieverStore = create((set) => ({
    recieverName: "",
    updateRecieverName: (name) => set({ recieverName: name }),
}));

export default useChatRecieverStore;