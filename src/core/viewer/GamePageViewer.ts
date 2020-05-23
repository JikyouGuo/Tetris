import { GameViewer, GameStatus } from '../types';
import SquareGroup from '../SquareGroup';
import SquarePageViewer from './SquarePageViewer';
import pageConfig from './pageConfig';
import Game from '../Game';
import gameConfig from '../gameConfig';

export default class GamePageViewer implements GameViewer {
  onGameStart(): void {
    pageConfig.dom.modal.hide();
  }
  onGamePause(): void {
    pageConfig.dom.modal.css({ display: 'flex' });
    pageConfig.dom.alert.html('PAUSE').css({ backgroundColor: 'deepskyblue' });
  }
  onGameOver(): void {
    pageConfig.dom.modal.css({ display: 'flex' });
    pageConfig.dom.alert.html('GAME OVER').css({ backgroundColor: 'red' });
  }
  onScoreChange(score: number): void {
    pageConfig.dom.score.html(score.toString());
  }
  init(game: Game): void {
    // 设置宽高
    {
      pageConfig.dom.curr.css({
        width: pageConfig.square.width * gameConfig.currContainer.width,
        height: pageConfig.square.height * gameConfig.currContainer.height,
      });
      pageConfig.dom.info.css({
        width: pageConfig.square.width * gameConfig.nextContainer.width,
        height: pageConfig.square.height * gameConfig.currContainer.height,
      });
      pageConfig.dom.next.css({
        width: pageConfig.square.width * gameConfig.nextContainer.width,
        height: pageConfig.square.height * gameConfig.nextContainer.height,
      });
    }
    // 注册事件
    document.onkeydown = e => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        game.controlRotate();
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        game.controlDown();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        game.controlLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        game.controlRight();
      } else if (e.key === ' ') {
        game.controlDirectlyDown();
      } else if (e.key === 'Enter') {
        if (game.status === GameStatus.GAMING) {
          game.pause();
        } else {
          game.start();
        }
      }
    };
  }
  showNext(nextSG: SquareGroup): void {
    nextSG.squares.forEach(s => {
      s.viewer = new SquarePageViewer(s, pageConfig.dom.next);
    });
  }
  switchTetris(currSG: SquareGroup): void {
    currSG.squares.forEach(s => {
      s.viewer?.remove();
      s.viewer = new SquarePageViewer(s, pageConfig.dom.curr);
    });
  }
}
