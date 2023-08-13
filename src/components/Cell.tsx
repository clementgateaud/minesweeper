import type { FunctionComponent, MouseEvent, TouchEvent } from "react";
import type { CellDisplayStatusType, CellType } from "../types";
import classNamesMaker from "classnames";
import { useRef, useState, useEffect } from "react";
import { useAppContext } from "../hooks";
import {
  getNumberOfAdjacentMines,
  revealMinedCells,
  revealNonMinedAdjacentCells,
  revealNumberOfAdjacentMines,
} from "../utils";
import styles from "./Cell.module.css";

type CellProps = {
  cell: CellType;
};

export const Cell: FunctionComponent<CellProps> = ({ cell }) => {
  const { displayStatus } = cell;
  const { isGameLost, isGameWon, grid, setGrid } = useAppContext();
  const [fontSize, setFontSize] = useState("16px");
  const [borderWidth, setBorderWidth] = useState("1px");
  const [touchStart, setTouchStart] = useState(0);
  const cellRef = useRef<HTMLDivElement | null>(null);

  const handleCellClick = (clickedCell: CellType) => {
    // do not allow click if game is finished
    if (isGameLost || isGameWon) {
      return;
    }
    // do not allow click if cell is already revealed or flagged
    if (clickedCell.displayStatus !== "covered") {
      return;
    }
    // if clicked cell is a mine, reveal all mines
    if (clickedCell.isMine) {
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

  const handleCellRightClick = (event: MouseEvent, clickedCell: CellType) => {
    event.preventDefault();
    flagCell(clickedCell);
  };

  const handleCellTouchStart = () => {
    setTouchStart(Date.now());
  };

  const handleCellTouchEnd = (event: TouchEvent, clickedCell: CellType) => {
    const touchDuration = Date.now() - touchStart;
    if (touchDuration > 500) {
      // Prevent the browser from translating the touch into a click
      event.preventDefault();
      flagCell(clickedCell);
    }
    setTouchStart(0);
  };

  useEffect(() => {
    const adjustFontSize = () => {
      if (cellRef.current) {
        setFontSize(`${cellRef.current.offsetWidth * 0.5}px`);
        setBorderWidth(`${cellRef.current.offsetWidth * 0.025}px`);
      }
    };

    adjustFontSize();

    window.addEventListener("resize", adjustFontSize);

    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [grid]);

  const CELL_CONTENT: {
    [key in CellDisplayStatusType]: string;
  } = {
    covered: "",
    flagged: "🚩",
    mine: "💣",
    mine_exploded: "💣",
    zero: "",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
  };

  return (
    <div
      className={classNamesMaker(styles.main, styles[displayStatus])}
      ref={cellRef}
      onClick={() => handleCellClick(cell)}
      onContextMenu={(event) => handleCellRightClick(event, cell)}
      onTouchStart={() => handleCellTouchStart()}
      onTouchEnd={(event) => handleCellTouchEnd(event, cell)}
      style={{
        fontSize,
        borderWidth,
      }}
    >
      {CELL_CONTENT[displayStatus]}
    </div>
  );
};
