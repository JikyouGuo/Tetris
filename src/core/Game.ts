import { GameStatus, MoveDirection, GameViewer } from './types';
import SquareGroup from './SquareGroup';
import { createSquareGroup } from './Tetris';
import { TetrisRules } from './TetrisRules';
import gameConfig from './gameConfig';
import Square from './Square';

export default class Game {
  private _status: GameStatus = GameStatus.OVER;

  public get status() {
    return this._status;
  }

  private _currTetris?: SquareGroup;
  private _nextTrtris!: SquareGroup;
  private _timer?: number;
  private _exist!: Square[];
  private _score!: number;
  private _duration!: number;

  public get duration(): number {
    return this._duration;
  }

  public set duration(v: number) {
    this._duration = v;
    if (this._timer) {
      this.clearTimer();
      this.autoDrop();
    }
  }
  private clearTimer() {
    clearInterval(this._timer);
    this._timer = undefined;
  }

  public get score(): number {
    return this._score;
  }
  public set score(v: number) {
    this._score = v;
    this._gv.onScoreChange(v);
    // 匹配难度
    this.duration = gameConfig.levels.filter(l => l.score <= this.score).pop()!.duration;
  }

  public constructor(private _gv: GameViewer) {
    this._gv.init(this);
  }

  public start() {
    if (this._status === GameStatus.GAMING) {
      return;
    }
    if (this._status === GameStatus.OVER) {
      this.init();
    }
    {
      this._status = GameStatus.GAMING;
      // 若当前没有，切换到下一个
      if (!this._currTetris) {
        this.switchTetris();
      }
      this.autoDrop();
      this._gv.onGameStart();
    }
  }

  public pause() {
    if (this._status === GameStatus.GAMING && this._timer) {
      this._status = GameStatus.PAUSE;
      this.clearTimer();
      this._gv.onGamePause();
    }
  }

  private over() {
    // 将要移入currContainer，但是游戏结束了，需要按照nextContainer的宽度重新设置位置
    this.resetCenter(this._currTetris!, gameConfig.nextContainer.width);
    this.clearTimer();
    this._status = GameStatus.OVER;
    this._gv.onGameOver();
  }

  private addScore(baseNum: number) {
    if (baseNum === 1) {
      this.score += 10;
    } else if (baseNum === 2) {
      this.score += 40;
    } else if (baseNum === 3) {
      this.score += 60;
    } else {
      this.score += 100;
    }
  }

  /**
   * 切换next到curr，需要显示
   */
  private switchTetris() {
    this._currTetris = this._nextTrtris;
    this.resetCenter(this._currTetris, gameConfig.currContainer.width);
    // 游戏结束
    if (!TetrisRules.canIMove(this._currTetris.shape, this._currTetris.center, this._exist)) {
      this.over();
      return;
    }
    this._gv.switchTetris(this._currTetris);
    this.showNextTetris();
  }

  private init() {
    this._currTetris?.squares.forEach(s => s.viewer?.remove());
    if (this._exist?.length > 0) {
      this._exist.forEach(s => s.viewer?.remove());
    }
    this._exist = [];
    this._currTetris = undefined;
    this.showNextTetris();
    this.score = 0;
    this._duration = gameConfig.levels[0].duration;
  }

  /**
   * 辅助：显示下一个
   */
  private showNextTetris() {
    this._nextTrtris = createSquareGroup();
    this.resetCenter(this._nextTrtris, gameConfig.nextContainer.width);
    this._gv.showNext(this._nextTrtris);
  }

  private autoDrop() {
    if (this._timer || this._status !== GameStatus.GAMING || !this._currTetris) {
      return;
    }
    this._timer = setInterval(() => {
      // 下落并判断触底
      if (!TetrisRules.move(this._currTetris as SquareGroup, MoveDirection.DOWN, this._exist)) {
        // 触底处理
        this.hitBottom();
      }
    }, this._duration);
  }

  /**
   * 渲染tetris时，需要在容器内居中、贴上
   * @param width 容器宽度（逻辑）
   */
  private resetCenter(sg: SquareGroup, width: number) {
    // 水平居中
    sg.center = { x: Math.floor(width / 2), y: sg.center.y };
    // 竖直贴上
    // 若有square的y坐标小于0
    while (sg.squares.some(s => s.coord.y < 0)) {
      // 向下移动一格
      sg.center = { x: sg.center.x, y: sg.center.y + 1 };
    }
  }

  /**
   * 触底处理
   * 何时：自动下落
   */
  private hitBottom() {
    // 1. 保存
    if (this._currTetris) {
      this._exist = [...this._exist, ...this._currTetris.squares];
      // 消除判断
      const scoreBase = TetrisRules.combo(this._currTetris, this._exist);
      if (scoreBase > 0) {
        this.addScore(scoreBase);
      }
    }
    // 2. 切换
    this.switchTetris();
  }

  public controlRotate() {
    if (this._status === GameStatus.GAMING && this._currTetris) {
      TetrisRules.rotate(this._currTetris, this._exist);
    }
  }
  public controlUp() {
    if (this._status === GameStatus.GAMING && this._currTetris) {
      TetrisRules.move(this._currTetris, MoveDirection.UP, this._exist);
    }
  }
  public controlDown() {
    if (this._status === GameStatus.GAMING && this._currTetris) {
      TetrisRules.move(this._currTetris, MoveDirection.DOWN, this._exist);
    }
  }
  public controlLeft() {
    if (this._status === GameStatus.GAMING && this._currTetris) {
      TetrisRules.move(this._currTetris, MoveDirection.LEFT, this._exist);
    }
  }
  public controlRight() {
    if (this._status === GameStatus.GAMING && this._currTetris) {
      TetrisRules.move(this._currTetris, MoveDirection.RIGHT, this._exist);
    }
  }
  public controlDirectlyDown() {
    if (this._status === GameStatus.GAMING && this._currTetris) {
      TetrisRules.moveDirectly(this._currTetris, MoveDirection.DOWN, this._exist);
    }
  }
}
