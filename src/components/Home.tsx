import type { FunctionComponent } from "react";
import { useState } from "react";
import { Container } from "./Container";
import { Grid } from "./Grid";
import styles from "./Home.module.css";
import { useAppContext } from "../hooks";
import { generateGrid } from "../utils";
import { DEFAULT_MINE_DENSITY, DEFAULT_GRID_SIZE } from "../constants";

export const Home: FunctionComponent = () => {
  const {
    setGrid,
    setRowsNumber,
    setColumnsNumber,
    setMinesDensity,
    isGameWon,
    setIsGameWon,
    isGameLost,
    setIsGameLost,
  } = useAppContext();

  const [gridSizeInput, setGridSizeInput] = useState<number>(DEFAULT_GRID_SIZE);
  const [minesDensityInput, setMinesDensityInput] =
    useState<number>(DEFAULT_MINE_DENSITY);

  const handleGridSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGridSizeInput(parseInt(event.target.value, 10));
  };

  const handleMinesDensityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMinesDensityInput(parseInt(event.target.value, 10));
  };

  const handleStartGame = () => {
    setGrid(
      generateGrid(
        gridSizeInput / 10,
        gridSizeInput / 10,
        minesDensityInput / 100
      )
    );
    setRowsNumber(gridSizeInput / 10);
    setColumnsNumber(gridSizeInput / 10);
    setMinesDensity(minesDensityInput / 100);
    setIsGameWon(false);
    setIsGameLost(false);
  };

  return (
    <Container className={styles.main}>
      <div>
        <h1>Minesweeper</h1>
        <div className={styles.gameSettings}>
          <div>
            <label htmlFor="gridSize">Grid size: </label>
            <select
              id="gridSize"
              onChange={(event) => handleGridSizeChange(event)}
              value={gridSizeInput.toString()}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="250">250</option>
              <option value="300">300</option>
              <option value="350">350</option>
              <option value="400">400</option>
              <option value="450">450</option>
              <option value="500">500</option>
            </select>
          </div>
          <div>
            <label htmlFor="minesDensity">Mines density: </label>
            <select
              id="minesDensity"
              onChange={(event) => handleMinesDensityChange(event)}
              value={minesDensityInput.toString()}
            >
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
              <option value="25">25%</option>
              <option value="30">30%</option>
              <option value="35">35%</option>
              <option value="40">40%</option>
              <option value="45">45%</option>
              <option value="50">50%</option>
              <option value="55">55%</option>
              <option value="60">60%</option>
              <option value="65">65%</option>
              <option value="70">70%</option>
              <option value="75">75%</option>
              <option value="80">80%</option>
              <option value="85">85%</option>
              <option value="90">90%</option>
              <option value="95">95%</option>
            </select>
          </div>
          <button onClick={handleStartGame}>Start new game</button>
        </div>
        <Grid />
        <div className={styles.gameResult}>
          {isGameLost && <h2>💣 You lost 💣</h2>}
          {isGameWon && <h2>🎉 You won 🎉</h2>}
        </div>
      </div>
    </Container>
  );
};
