import type { GridType, CellType } from "../types";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  generateGrid,
  getNumberOfAdjacentMines,
  revealNonMinedAdjacentCells,
  revealMinedCells,
  revealNumberOfAdjacentMines,
  isGameWon as isGameWonUtil,
} from "../utils";
import { AppContext } from "../contexts";
import { DEFAULT_MINE_DENSITY, DEFAULT_GRID_SIZE } from "../constants";

export const AppProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [rowsNumber, setRowsNumber] = useState<number>(DEFAULT_GRID_SIZE / 10);
  const [columnsNumber, setColumnsNumber] = useState<number>(
    DEFAULT_GRID_SIZE / 10
  );
  const [minesDensity, setMinesDensity] = useState<number>(
    DEFAULT_MINE_DENSITY / 100
  );
  const initialGrid = generateGrid(rowsNumber, columnsNumber, minesDensity);
  const [grid, setGrid] = useState<GridType>(initialGrid);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    setIsGameWon(isGameWonUtil(grid));
  }, [grid]);

  const handleCellClick = (clickedCell: CellType) => {
    // do not allow click if game is finished
    if (isGameLost || isGameWon) {
      return;
    }
    // do not allow click if cell is already revealed or flagged
    if (clickedCell.displayStatus !== "covered") {
      return;
    }
    // if clicked cell is a mine, reveal all mines and game Lost
    if (clickedCell.isMine) {
      setIsGameLost(true);
      setGrid(revealMinedCells(grid, clickedCell));
      return;
    }
    const numberOfAdjacentMines = getNumberOfAdjacentMines(grid, clickedCell);
    // if clicked cell has no adjacent mines, reveal all adjacent cells
    if (numberOfAdjacentMines === 0) {
      setGrid(revealNonMinedAdjacentCells(grid, clickedCell));
    }
    // if clicked cell has adjacent mines, reveal only clicked cell
    setGrid(
      revealNumberOfAdjacentMines(grid, clickedCell, numberOfAdjacentMines)
    );
  };

  const flagCell = (clickedCell: CellType) => {
    // do not allow right click if game is finished
    if (isGameLost || isGameWon) {
      return;
    }
    // do not allow right click if cell is already revealed
    if (
      clickedCell.displayStatus === "covered" ||
      clickedCell.displayStatus === "flagged"
    ) {
      setGrid((prevGrid) => {
        return prevGrid.map((row) => {
          return row.map((gridCell) => {
            if (gridCell.id === clickedCell.id) {
              return {
                ...gridCell,
                displayStatus:
                  gridCell.displayStatus === "covered" ? "flagged" : "covered",
              };
            }
            return gridCell;
          });
        });
      });
    }
  };

  const handleCellRightClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    clickedCell: CellType
  ) => {
    event.preventDefault();
    flagCell(clickedCell);
  };

  const handleCellTouchStart = () => {
    setTouchStart(Date.now());
  };

  const handleCellTouchEnd = (
    event: React.TouchEvent,
    clickedCell: CellType
  ) => {
    const touchDuration = Date.now() - touchStart;
    if (touchDuration > 500) {
      // Prevent the browser from translating the touch into a click
      event.preventDefault();
      flagCell(clickedCell);
    }
    setTouchStart(0);
  };

  return (
    <AppContext.Provider
      value={{
        grid,
        setGrid,
        setRowsNumber,
        setColumnsNumber,
        setMinesDensity,
        handleCellClick,
        handleCellRightClick,
        handleCellTouchStart,
        handleCellTouchEnd,
        isGameLost,
        setIsGameLost,
        isGameWon,
        setIsGameWon,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
