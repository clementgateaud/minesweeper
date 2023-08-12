import type { FunctionComponent } from "react";
import type { CellDisplayStatusType, CellType } from "../types";
import { useRef, useState, useEffect } from "react";
import styles from "./Cell.module.css";
import { useAppContext } from "../providers/AppProvider";

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
  const [borderSize, setBorderSize] = useState("1px");
  const cellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      if (cellRef.current) {
        setFontSize(`${cellRef.current.offsetWidth * 0.5}px`);
        setBorderSize(`${cellRef.current.offsetWidth * 0.025}px`);
      }
    };

    adjustFontSize();

    window.addEventListener("resize", adjustFontSize);

    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, []);

  const DISPLAY_STATUS: {
    status: CellDisplayStatusType;
    content: string;
  }[] = [
    { status: "covered", content: "" },
    { status: "flagged", content: "🚩" },
    { status: "mine", content: "💣" },
    { status: "mine_exploded", content: "💣" },
    { status: "zero", content: "" },
    { status: "one", content: "1" },
    { status: "two", content: "2" },
    { status: "three", content: "3" },
    { status: "four", content: "4" },
    { status: "five", content: "5" },
    { status: "six", content: "6" },
    { status: "seven", content: "7" },
    { status: "eight", content: "8" },
  ];

  return (
    <div
      className={styles.main}
      ref={cellRef}
      onClick={() => handleCellClick(cell)}
      onContextMenu={(event) => handleCellRightClick(event, cell)}
      onTouchStart={() => handleCellTouchStart()}
      onTouchEnd={(event) => handleCellTouchEnd(event, cell)}
    >
      {DISPLAY_STATUS.map((status) => {
        if (displayStatus === status.status) {
          return (
            <div
              key={status.status}
              className={styles[status.status]}
              style={{
                fontSize,
                borderWidth: `${borderSize}`,
              }}
            >
              {status.content}
            </div>
          );
        }
      })}
    </div>
  );
};
