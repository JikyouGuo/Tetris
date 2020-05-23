import { Coord, MoveDirection, isCoord, Shape } from './types';
import SquareGroup from './SquareGroup';
import gameConfig from './gameConfig';
import Square from './Square';

export class TetrisRules {
  /**
   * 判断能否移动到目标位置
   * @param shape 为了可以让rotate复用，使用shape
   * @param targetCenter
   */
  public static canIMove(shape: Shape, targetCenter: Coord, exist: Square[]): boolean {
    const targetCoords = shape.map(s => ({ x: s.x + targetCenter.x, y: s.y + targetCenter.y }));
    // 边界判断
    let result = targetCoords.some(
      c => c.x < 0 || c.x > gameConfig.currContainer.width - 1 || c.y < 0 || c.y > gameConfig.currContainer.height - 1,
    );
    if (result) {
      // 接触到边界
      return false;
    }
    // 接触判断：exist中有targetCenter中有的
    result = exist.some(s => targetCoords.some(c => c.x === s.coord.x && c.y === s.coord.y));
    if (result) {
      // 接触到已存在square
      return false;
    }
    return true;
  }

  public static move(sg: SquareGroup, targetCenter: Coord, exist: Square[]): boolean;
  public static move(sg: SquareGroup, direction: MoveDirection, exist: Square[]): boolean;
  public static move(sg: SquareGroup, target: Coord | MoveDirection, exist: Square[]): boolean {
    // 坐标
    if (isCoord(target)) {
      // 判断能否移动
      if (this.canIMove(sg.shape, target, exist)) {
        // 若可以，移动
        sg.center = target;
        return true;
      } else {
        // 否则，返回
        return false;
      }
    }
    // 方向
    else {
      let targetCenter;
      // 计算坐标
      if (target === MoveDirection.DOWN) {
        targetCenter = { x: sg.center.x, y: sg.center.y + 1 };
      } else if (target === MoveDirection.LEFT) {
        targetCenter = { x: sg.center.x - 1, y: sg.center.y };
      } else if (target === MoveDirection.RIGHT) {
        targetCenter = { x: sg.center.x + 1, y: sg.center.y };
      } else {
        targetCenter = { x: sg.center.x, y: sg.center.y - 1 };
      }
      // 按坐标重新调用
      return this.move(sg, targetCenter, exist);
    }
  }

  /**
   * 向某方向移动到不能移动为止
   */
  public static moveDirectly(sg: SquareGroup, direction: MoveDirection, exist: Square[]): void {
    while (this.move(sg, direction, exist)) {}
  }

  public static rotate(sg: SquareGroup, exist: Square[]) {
    if (this.canIMove(sg.getRotatedShape(), sg.center, exist)) {
      sg.rotate();
      return true;
    } else {
      return false;
    }
  }

  // 何时：处理触底，保存后
  public static combo(sg: SquareGroup, exist: Square[]): number {
    // 获取combo***
    // 获取y坐标数组
    const ys = sg.squares.map(s => s.coord.y);
    // 逐行检查
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    // 记录消除了多少行
    let lines = 0;
    for (let line = yMin; line <= yMax; line++) {
      // 从上到下拿出该行所有square
      const lineSquares = exist.filter(s => s.coord.y === line);
      // 判断并处理combo***
      if (lineSquares.length === gameConfig.currContainer.width) {
        lines++;
        // 1. 移除行
        // 1.1 从界面中移除
        lineSquares.forEach(s => s.viewer?.remove());
        // 1.2 从数组中移除
        exist.splice(0, exist.length, ...exist.filter(s => s.coord.y !== line));
        // 2. 下移
        exist.filter(s => s.coord.y < line).forEach(s => (s.coord = { x: s.coord.x, y: s.coord.y + 1 }));
      }
    }
    return lines;
  }
}
