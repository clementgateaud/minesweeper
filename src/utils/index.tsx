import { CellDisplayStatusType, GridType, CellType } from "../types";

// Fisher-Yates (aka Durstenfeld, Knuth) shuffle algorithm
const shuffleArray = (array: number[]): number[] => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const generateGrid = (
  rowsNumber: number,
  columnsNumber: number,
  minesPercentage: number
): GridType => {
  let idCounter = 0;

  // Step 1: Calculate the total number of mines
  const totalCells = rowsNumber * columnsNumber;
  const totalMines = Math.round(totalCells * minesPercentage);

  // Generate an array of all possible cell indices
  const allIndices = Array.from({ length: totalCells }, (_, i) => i);

  // Shuffle the indices and pick the first `totalMines` number of indices
  const mineIndices = shuffleArray(allIndices).slice(0, totalMines);

  const grid = Array.from({ length: rowsNumber }, (_, rowIndex) =>
    Array.from({ length: columnsNumber }, (_, columnIndex) => {
      const currentIndex = rowIndex * columnsNumber + columnIndex;
      return {
        id: idCounter++,
        displayStatus: "covered" as CellDisplayStatusType,
        isMine: mineIndices.includes(currentIndex),
        rowIndex,
        columnIndex,
      };
    })
  );

  return grid;
};

export const getNumberOfAdjacentMines = (
  grid: GridType,
  cell: CellType
): number => {
  const rowsNumber = grid.length;
  const columnsNumber = grid[0].length;

  const rowIndex = cell.rowIndex;
  const columnIndex = cell.columnIndex;

  let numberOfAdjacentMines = 0;

  // check top left
  if (rowIndex > 0 && columnIndex > 0) {
    if (grid[rowIndex - 1][columnIndex - 1].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check top
  if (rowIndex > 0) {
    if (grid[rowIndex - 1][columnIndex].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check top right
  if (rowIndex > 0 && columnIndex < columnsNumber - 1) {
    if (grid[rowIndex - 1][columnIndex + 1].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check left
  if (columnIndex > 0) {
    if (grid[rowIndex][columnIndex - 1].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check right
  if (columnIndex < columnsNumber - 1) {
    if (grid[rowIndex][columnIndex + 1].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check bottom left
  if (rowIndex < rowsNumber - 1 && columnIndex > 0) {
    if (grid[rowIndex + 1][columnIndex - 1].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check bottom
  if (rowIndex < rowsNumber - 1) {
    if (grid[rowIndex + 1][columnIndex].isMine) {
      numberOfAdjacentMines++;
    }
  }

  // check bottom right
  if (rowIndex < rowsNumber - 1 && columnIndex < columnsNumber - 1) {
    if (grid[rowIndex + 1][columnIndex + 1].isMine) {
      numberOfAdjacentMines++;
    }
  }

  return numberOfAdjacentMines;
};

export const getAdjacentCells = (
  grid: GridType,
  cell: CellType
): CellType[] => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const rowIndex = grid.findIndex((row) => row.some((c) => c.id === cell.id));
  const cellIndex = grid[rowIndex].findIndex((c) => c.id === cell.id);

  return directions
    .map(([dx, dy]) => {
      const x = rowIndex + dx;
      const y = cellIndex + dy;
      if (x >= 0 && x < grid.length && y >= 0 && y < grid[x].length) {
        return grid[x][y];
      }
      return null;
    })
    .filter(Boolean) as CellType[];
};

export const getCellDisplayStatusFromNumberOfAdjacentMines = (
  numberOfAdjacentMines: number
): CellType["displayStatus"] => {
  switch (numberOfAdjacentMines) {
    case 0:
      return "zero";
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "three";
    case 4:
      return "four";
    case 5:
      return "five";
    case 6:
      return "six";
    case 7:
      return "seven";
    case 8:
      return "eight";
    default:
      throw new Error(
        `Invalid number of adjacent mines: ${numberOfAdjacentMines}`
      );
  }
};

export const revealNonMinedAdjacentCells = (
  grid: GridType,
  cell: CellType
): GridType => {
  let newGrid = [...grid.map((row) => [...row])];

  const adjacentCells = getAdjacentCells(newGrid, cell);
  for (const adjacentCell of adjacentCells) {
    if (adjacentCell.displayStatus === "covered" && !adjacentCell.isMine) {
      const numberOfAdjacentMines = getNumberOfAdjacentMines(
        newGrid,
        adjacentCell
      );
      adjacentCell.displayStatus =
        getCellDisplayStatusFromNumberOfAdjacentMines(numberOfAdjacentMines);
      if (numberOfAdjacentMines === 0) {
        newGrid = revealNonMinedAdjacentCells(newGrid, adjacentCell);
      }
    }
  }
  return newGrid;
};

export const revealMinedCells = (grid: GridType, clickedCell: CellType) =>
  grid.map((row) => {
    return row.map((gridCell) => {
      if (gridCell.isMine) {
        return {
          ...gridCell,
          displayStatus:
            gridCell === clickedCell
              ? ("mine_exploded" as CellDisplayStatusType)
              : ("mine" as CellDisplayStatusType),
        };
      }
      return gridCell;
    });
  });

export const revealNumberOfAdjacentMines = (
  grid: GridType,
  cell: CellType,
  numberOfAdjacentMines: number
): GridType =>
  grid.map((row) => {
    return row.map((gridCell) => {
      if (gridCell.id === cell.id) {
        return {
          ...gridCell,
          displayStatus: getCellDisplayStatusFromNumberOfAdjacentMines(
            numberOfAdjacentMines
          ),
        };
      }
      return gridCell;
    });
  });

export const isGameWon = (grid: GridType): boolean =>
  grid.every((row) => {
    return row.every((cell) => {
      return cell.isMine || cell.displayStatus !== "covered";
    });
  });

export const isGameLost = (grid: GridType): boolean =>
  grid.some((row) => {
    return row.some((cell) => {
      return cell.isMine && cell.displayStatus === "mine_exploded";
    });
  });
