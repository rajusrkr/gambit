import { create } from "zustand";
import { persist } from "zustand/middleware";

type formTabs = "CT" | "DR" | "O" | "SE";

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

  currentCreateMarketFormTab: formTabs;
  setCurrentCreateMarketFormTab: (tab: string) => void;
}

export const useAdminStore = create(
  persist<States>(
    (set) => ({
      email: "",
      name: "",
      role: "",
      currentCreateMarketFormTab: "CT",

      setAdminStates: ({ email, name, role }) => {
        set({ email, name, role });
      },
      setCurrentCreateMarketFormTab: (tab) => {
        set({ currentCreateMarketFormTab: tab as formTabs });
      },
    }),
    { name: "gambit-admin-store" },
  ),
);
