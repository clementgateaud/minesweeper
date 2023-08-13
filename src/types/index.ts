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
  setGrid: React.Dispatch<React.SetStateAction<GridType>>;
  isGameWon: boolean;
  setIsGameWon: React.Dispatch<React.SetStateAction<boolean>>;
  isGameLost: boolean;
  setIsGameLost: React.Dispatch<React.SetStateAction<boolean>>;
};
