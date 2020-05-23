import SquareGroup from './SquareGroup';
import Game from './Game';

export interface Coord {
  // 防止直接更改
  readonly x: number;
  readonly y: number;
}
export const isCoord = (target: any): target is Coord => (target.x === undefined ? false : true);
export interface IViewer {
  show(): void;
  remove(): void;
}
export type Shape = Coord[];
export enum MoveDirection {
  DOWN,
  LEFT,
  RIGHT,
  UP,
}
export enum GameStatus {
  GAMING,
  PAUSE,
  OVER,
}
export interface GameViewer {
  showNext(nextSG: SquareGroup): void;
  switchTetris(currSG: SquareGroup): void;
  init(game: Game): void;
  onScoreChange(score: number): void;
  onGameStart(): void;
  onGamePause(): void;
  onGameOver(): void;
}
