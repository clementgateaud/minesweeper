import type { FunctionComponent, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { Container } from "./Container";
import { Grid } from "./Grid";
import styles from "./Home.module.css";
import { useAppContext } from "../hooks";
import { DEFAULT_MINE_DENSITY, DEFAULT_GRID_SIZE } from "../constants";
import { generateGrid } from "../utils";

export const Home: FunctionComponent = () => {
  const { isGameWon, setIsGameWon, isGameLost, setIsGameLost, setGrid } =
    useAppContext();

  const [gridSizeInput, setGridSizeInput] = useState<number>(DEFAULT_GRID_SIZE);
  const [minesDensityInput, setMinesDensityInput] =
    useState<number>(DEFAULT_MINE_DENSITY);

  const [emojis, setEmojis] = useState<
    {
      id: string;
      emoji: string;
      leftPosition: number;
    }[]
  >([]);

  const handleGridSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGridSizeInput(parseInt(event.target.value));
  };

  const handleMinesDensityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setMinesDensityInput(parseFloat(event.target.value));
  };

  const handleStartGame = (gridSize: number, minesDensity: number) => {
    setGrid(generateGrid(gridSize / 10, gridSize / 10, minesDensity));
    setIsGameWon(false);
    setIsGameLost(false);
  };

  let id = 1;
  useEffect(() => {
    // reset emoji elements from previous game
    setEmojis([]);
    if (!isGameWon && !isGameLost) {
      return;
    }
    const emojis = isGameWon ? ["😍", "🎉"] : ["😭", "💩"];
    const interval = setInterval(() => {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      const randomLeftPosition = Math.random();

      const newEmoji = {
        id: id.toString(),
        emoji: randomEmoji,
        leftPosition: randomLeftPosition,
      };

      setEmojis((prevEmojis) => [...prevEmojis, newEmoji]);

      // remove emoji after animation ends
      setTimeout(() => {
        setEmojis((prevEmojis) => {
          return prevEmojis.filter((emoji) => emoji.id !== newEmoji.id);
        });
      }, 3000);

      id++;
    }, 30); // interval for new emoji

    return () => {
      clearInterval(interval);
    };
  }, [isGameWon, isGameLost, id]);

  return (
    <Container className={styles.main}>
      <div>
        <h1>Minesweeper</h1>
        <div className={styles.gameSettings}>
          <div className={styles.gameSettingsInput}>
            <div className={styles.gridSize}>
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
            <div className={styles.minesDensity}>
              <label htmlFor="minesDensity">Mines density: </label>
              <select
                id="minesDensity"
                onChange={(event) => handleMinesDensityChange(event)}
                value={minesDensityInput.toString()}
              >
                <option value="0.05">5%</option>
                <option value="0.10">10%</option>
                <option value="0.15">15%</option>
                <option value="0.20">20%</option>
                <option value="0.25">25%</option>
                <option value="0.30">30%</option>
                <option value="0.35">35%</option>
                <option value="0.40">40%</option>
                <option value="0.45">45%</option>
                <option value="0.50">50%</option>
                <option value="0.55">55%</option>
                <option value="0.60">60%</option>
                <option value="0.65">65%</option>
                <option value="0.70">70%</option>
                <option value="0.75">75%</option>
                <option value="0.80">80%</option>
                <option value="0.85">85%</option>
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => handleStartGame(gridSizeInput, minesDensityInput)}
            className={styles.button}
          >
            Start new game
          </button>
        </div>
        {(isGameWon || isGameLost) && (
          <>
            {emojis.map((emoji) => (
              <span
                className={styles.emoji}
                style={{
                  // -12px so that an emoji can be half visible on left and right side
                  left: `${emoji.leftPosition * window.innerWidth - 12}px`,
                }}
                key={emoji.id}
              >
                {emoji.emoji}
              </span>
            ))}
          </>
        )}
        <Grid />
      </div>
    </Container>
  );
};
