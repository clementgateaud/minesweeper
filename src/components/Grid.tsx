import type { FunctionComponent } from "react";
import { Cell } from "./Cell";
import styles from "./Grid.module.css";
import { useAppContext } from "../hooks";

export const Grid: FunctionComponent = () => {
  const { grid } = useAppContext();
  return (
    <div className={styles.main}>
      {grid.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            className={styles.row}
            style={{ height: `${100 / grid.length}%` }}
          >
            {row.map((cell) => {
              return <Cell key={cell.id} cell={cell} />;
            })}
          </div>
        );
      })}
    </div>
  );
};
