import { IViewer } from '../types';
import Square from '../Square';
import $ from 'jquery';
import pageConfig from './pageConfig';
/**
 * 显示者
 */
export default class SquarePageViewer implements IViewer {
  private dom?: JQuery<HTMLElement>;
  private isRemove: boolean = false;
  public constructor(private square: Square, private container: JQuery<HTMLElement>) {}
  /**
   * 创建真实dom对象，加入指定容器
   */
  show() {
    if (this.isRemove) {
      return;
    }
    if (!this.dom) {
      this.dom = $('<div/>')
        .css({
          width: pageConfig.square.width,
          height: pageConfig.square.height,
          position: 'absolute',
          border: '1.2px solid #666',
          'box-sizing': 'border-box',
          'border-radius': 5,
        })
        .prependTo(this.container);
    }
    this.dom.css({
      left: pageConfig.square.width * this.square.coord.x,
      top: pageConfig.square.height * this.square.coord.y,
      'background-color': this.square.color,
    });
  }
  /**
   * 移除真实dom
   */
  remove() {
    if (this.dom && !this.isRemove) {
      this.dom.remove();
      this.isRemove = true;
    }
  }
}
