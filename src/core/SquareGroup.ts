import { Shape, Coord } from './types';
import Square from './Square';

export default abstract class SquareGroup {
  private _squares: readonly Square[] = [];
  public get squares() {
    return this._squares;
  }
  /**
   * @param _shape 形状，坐标数组
   * @param _center 中心点坐标
   * @param _color 颜色
   */
  public constructor(private _shape: Shape, private _center: Coord, private _color: string) {
    // 遍历形状（坐标数组）创建Square，push到_squares统一管理
    const squares: Square[] = [];
    this._shape.forEach(c => {
      const s = new Square();
      s.color = this._color;
      squares.push(s);
    });
    this._squares = squares;
    // 设置square的coord和color
    this.setSquaresCoords();
  }
  public get shape(): Shape {
    return this._shape;
  }
  public set shape(v: Shape) {
    this._shape = v;
    this.setSquaresCoords();
  }
  public get center(): Coord {
    return this._center;
  }
  public set center(v: Coord) {
    this._center = v;
    // 改变中心点，同时改变整个squares
    this.setSquaresCoords();
  }
  /**
   * 辅助：设置squares内所有square的坐标
   */
  private setSquaresCoords() {
    this._squares.forEach((s, i) => {
      s.coord = { x: this._shape[i].x + this._center.x, y: this._shape[i].y + this._center.y };
    });
  }
  protected isClockwise: boolean = false;
  /**
   * 获得一个SquareGroup旋转后的shape
   */
  public getRotatedShape(): Shape {
    if (this.isClockwise) {
      return this._shape.map(c => ({ x: -c.y, y: c.x }));
    } else {
      return this._shape.map(c => ({ x: c.y, y: -c.x }));
    }
  }
  /**
   * 旋转：改变squareGroup的形状
   */
  public rotate(): void {
    const shape = this.getRotatedShape();
    if (shape) {
      this.shape = shape;
    }
  }
}
