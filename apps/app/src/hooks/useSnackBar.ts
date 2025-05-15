import { create } from "zustand";

interface SnackBarStore {
  snackBarMessage: string;
  setSnackBarMessage: (m: string) => void;
}

const useSnackBar = create<SnackBarStore>((set) => ({
  snackBarMessage: "",
  setSnackBarMessage: (m: string) => set({ snackBarMessage: m }),
}));

export default useSnackBar;
