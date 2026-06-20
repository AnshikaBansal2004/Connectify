import {create} from "zustand";

const useUsersStore = create ((set) =>({
      users : [],
      updateUsers : (users) =>set({users:users}),
}));

export default useUsersStore;

