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
  setRowsNumber: React.Dispatch<React.SetStateAction<number>>;
  setColumnsNumber: React.Dispatch<React.SetStateAction<number>>;
  minesPercentage: number;
  setMinesPercentage: React.Dispatch<React.SetStateAction<number>>;
  handleCellClick: (clickedCell: CellType) => void;
  handleCellRightClick: (
    event: React.MouseEvent<Element, MouseEvent>,
    clickedCell: CellType
  ) => void;
  handleCellTouchStart: () => void;
  handleCellTouchEnd: (event: React.TouchEvent, clickedCell: CellType) => void;
  isGameLost: boolean;
  setIsGameLost: React.Dispatch<React.SetStateAction<boolean>>;
  isGameWon: boolean;
  setIsGameWon: React.Dispatch<React.SetStateAction<boolean>>;
};
