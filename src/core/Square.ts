import { Coord, IViewer } from './types';
export default class Square {
  private _viewer?: IViewer;
  private _coord: Coord = { x: 0, y: 0 };
  private _color: string = '';
  public get viewer() {
    return this._viewer;
  }
  public set viewer(val) {
    this._viewer = val;
    if (val) {
      val.show();
    }
  }
  public get coord() {
    return this._coord;
  }
  public set coord(v: Coord) {
    this._coord = v;
    if (this._viewer) {
      this._viewer.show();
    }
  }
  public get color() {
    return this._color;
  }
  public set color(v: string) {
    this._color = v;
  }
}
