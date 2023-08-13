import type { Dispatch, SetStateAction } from "react";

export type CellDisplayStatusType =
  | "covered"
  | "flagged"
  | "mine"
  | "mine_exploded"
  | "zero"
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight";

export type CellType = {
  id: number;
  displayStatus: CellDisplayStatusType;
  isMine: boolean;
  rowIndex: number;
  columnIndex: number;
};

export type GridType = CellType[][];

export type AppContextType = {
  grid: GridType;
  setGrid: Dispatch<SetStateAction<GridType>>;
  isGameWon: boolean;
  setIsGameWon: Dispatch<SetStateAction<boolean>>;
  isGameLost: boolean;
  setIsGameLost: Dispatch<SetStateAction<boolean>>;
};
