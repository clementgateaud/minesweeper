import type { GridType } from "../types";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  generateGrid,
  isGameWon as isGameWonUtil,
  isGameLost as isGameLostUtil,
} from "../utils";
import { AppContext } from "../contexts";
import { DEFAULT_MINE_DENSITY, DEFAULT_GRID_SIZE } from "../constants";

export const AppProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const initialGrid = generateGrid(
    DEFAULT_GRID_SIZE / 10,
    DEFAULT_GRID_SIZE / 10,
    DEFAULT_MINE_DENSITY
  );
  const [grid, setGrid] = useState<GridType>(initialGrid);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    setIsGameWon(isGameWonUtil(grid));
    setIsGameLost(isGameLostUtil(grid));
  }, [grid]);

  return (
    <AppContext.Provider
      value={{
        grid,
        setGrid,
        isGameWon,
        setIsGameWon,
        isGameLost,
        setIsGameLost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
