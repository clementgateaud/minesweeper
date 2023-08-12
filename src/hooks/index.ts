import type { AppContextType } from "../types";
import { useContext } from "react";
import { AppContext } from "../contexts";

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a FormProvider");
  }
  return context;
};
