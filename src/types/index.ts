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
