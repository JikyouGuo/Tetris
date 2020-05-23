import { Coord } from './types';
import SquareGroup from './SquareGroup';
import { getRandom } from './util';
import pageConfig from './viewer/pageConfig';
/**
 * center: 下2
 */
export class IIShape extends SquareGroup {
  constructor(center: Coord, color: string) {
    super(
      [
        { x: -1, y: -2 },
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
      ],
      center,
      color,
    );
  }
  private isRotated: boolean = false;
  public rotate() {
    if (this.isRotated) {
      this.isClockwise = !this.isClockwise;
    }
    super.rotate();
    this.isRotated = true;
  }
}
/**
 * center: 中
 */
export class LLShape extends SquareGroup {
  constructor($_center: Coord, $_color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: -1, y: -1 },
      ],
      $_center,
      $_color,
    );
  }
}
/**
 * center: 中右空
 */
export class LLShapeMirror extends SquareGroup {
  constructor($_center: Coord, $_color: string) {
    super(
      [
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
      ],
      $_center,
      $_color,
    );
  }
}
/**
 * center: 交点
 */
export class TTShape extends SquareGroup {
  constructor($_center: Coord, $_color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      $_center,
      $_color,
    );
  }
}
/**
 * center: 上拐点
 */
export class ZZShape extends SquareGroup {
  constructor($_center: Coord, $_color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      $_center,
      $_color,
    );
  }
  private isRotated: boolean = false;
  public rotate() {
    if (this.isRotated) {
      this.isClockwise = !this.isClockwise;
    }
    this.shape = this.getRotatedShape();
    this.isRotated = true;
  }
}
/**
 * center: 上拐点
 */
export class ZZShapeMirror extends SquareGroup {
  constructor($_center: Coord, $_color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
      ],
      $_center,
      $_color,
    );
  }
  private isRotated: boolean = false;
  public rotate() {
    if (this.isRotated) {
      this.isClockwise = !this.isClockwise;
    }
    this.shape = this.getRotatedShape();
    this.isRotated = true;
  }
}
/**
 * center: 右上
 */
export class OOShape extends SquareGroup {
  constructor($_center: Coord, $_color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
      ],
      $_center,
      $_color,
    );
  }
  public getRotatedShape() {
    return this.shape;
  }
}
// TODO 若使用类型 SquareGroup ，检测出缺失实现
// export const SHAPE2: SquareGroup[] = [IIShape, LLShape, LLShapeMirror, TTShape, ZZShape, ZZShapeMirror, OOShape];
export const SHAPE = [IIShape, LLShape, LLShapeMirror, TTShape, ZZShape, ZZShapeMirror, OOShape];
export const COLOR: string[] = [
  // red:
  'crimson',
  // orange:
  'coral',
  // yellow:
  'gold',
  // green:
  'mediumseagreen',
  // blue:
  'deepskyblue',
  // indigo:
  'indigo',
  // purple:
  'blueviolet',
];
/**
 * 生产者：随机Tetris
 */
export const createSquareGroup = (): SquareGroup =>
  // 随机形状
  new SHAPE[getRandom(0, SHAPE.length)](
    // new SHAPE[6](
    // 中心点
    pageConfig.squareGroup.center,
    // 随机颜色
    COLOR[getRandom(0, COLOR.length)],
  );
