import type { FunctionComponent } from "react";
import type { CellDisplayStatusType, CellType } from "../types";
import { useRef, useState, useEffect } from "react";
import styles from "./Cell.module.css";
import { useAppContext } from "../hooks";

type CellProps = {
  cell: CellType;
};

export const Cell: FunctionComponent<CellProps> = ({ cell }) => {
  const { displayStatus } = cell;
  const {
    handleCellClick,
    handleCellRightClick,
    handleCellTouchStart,
    handleCellTouchEnd,
  } = useAppContext();
  const [fontSize, setFontSize] = useState("16px");
  const [borderWidth, setBorderWidth] = useState("1px");
  const cellRef = useRef<HTMLDivElement | null>(null);

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
  }, []);

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
      className={styles.main}
      ref={cellRef}
      onClick={() => handleCellClick(cell)}
      onContextMenu={(event) => handleCellRightClick(event, cell)}
      onTouchStart={() => handleCellTouchStart()}
      onTouchEnd={(event) => handleCellTouchEnd(event, cell)}
    >
      <div
        className={styles[displayStatus]}
        style={{
          fontSize,
          borderWidth,
        }}
      >
        {CELL_CONTENT[displayStatus]}
      </div>
    </div>
  );
};
