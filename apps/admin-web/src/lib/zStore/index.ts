import { create } from "zustand";
import { persist } from "zustand/middleware";

interface States {
  name: string;
  email: string;
  role: string;
  setAdminStates: ({
    name,
    email,
    role,
  }: {
    name: string;
    email: string;
    role: string;
  }) => void;
}

export const useAdminStore = create(
  persist<States>(
    (set) => ({
      email: "",
      name: "",
      role: "",
      setAdminStates: ({ email, name, role }) => {
        set({ email, name, role });
      },
    }),
    { name: "gambit-admin-store" },
  ),
);
