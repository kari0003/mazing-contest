import * as React from 'react';

import { Vec2, IVec2 } from '../utils/Vec';
import { EventManager } from '../eventManager';

export interface IMapRendererProps {
  mapDimensions: IVec2;
  eventManager: EventManager;
  gameInfo: IGameInfo;
  path: IVec2[];
}
export interface IMapRendererState {}
interface IGameInfo {
  gameRef: string;
  mapTiles: IVec2;
  mapPathing: boolean[][];
  path: IVec2[];
}

export class MapRenderer extends React.Component<IMapRendererProps, IMapRendererState> {
  public mapDimensions: Vec2;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private gridSize: Vec2;

  constructor(props: IMapRendererProps) {
    super(props);
    console.log('props', props);
    this.mapDimensions = new Vec2(props.mapDimensions);
    this.gridSize = this.mapDimensions.divide(props.gameInfo.mapTiles);
  }

  render () {
    if (this.ctx) {
      this.drawGame();
    }
    return (
      <canvas
        ref={(e) => {
          if (!this.ctx && e) {
            this.canvas = e;
            this.ctx = e.getContext('2d')!;
          }
        }}
        width={this.mapDimensions.x}
        height={this.mapDimensions.y}
      />
    );
  }

  componentDidMount() {
    this.drawGame();
    this.props.eventManager.mount(this.canvas);
  }

  drawGame() {
    if (!this.ctx) {
      throw new Error('Canvas context does not exist yet!');
    }

    this.clearCanvas();

    this.drawPathing();
    this.drawTiles();
    this.drawGrid();
  }

  drawPathing() {
    // Create gradient
    var grd = this.ctx.createLinearGradient(0, 0, 400, 50);
    grd.addColorStop(0, 'red');
    grd.addColorStop(1, 'orange');

    // Fill with gradient
    this.ctx.fillStyle = grd;
    for (let x = 0; x < this.props.gameInfo.mapTiles.x; x ++) {
      for (let y = 0; y < this.props.gameInfo.mapTiles.y; y ++) {
        if (!this.props.gameInfo.mapPathing[x][y]) {
          this.ctx.fillRect(x * this.gridSize.x, y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
        }
      }
    }
  }

  drawTiles() {
    this.props.path.forEach(tile => {
      // Create gradient
      var grd = this.ctx.createLinearGradient(0, 400, 50, 0);
      grd.addColorStop(0, 'yellow');
      grd.addColorStop(1, 'green');

      // Fill with gradient
      this.ctx.fillStyle = grd;
      this.ctx.fillRect(tile.x * this.gridSize.x, tile.y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
    });
  }

  drawGrid() {
    this.ctx.strokeStyle = 'brown';
    for (let x = 0; x < this.props.gameInfo.mapTiles.x; x++) {
      this.drawLine(this.gridSize.x * x, 0, this.gridSize.x * x, this.mapDimensions.y);
    }
    this.drawLine(this.mapDimensions.x - 1, 0, this.mapDimensions.x - 1, this.mapDimensions.y);

    for (let y = 0; y < this.props.gameInfo.mapTiles.y; y++) {
      this.drawLine(0, this.gridSize.y * y, this.mapDimensions.x, this.gridSize.y * y);
    }
    this.drawLine(0, this.mapDimensions.y - 1, this.mapDimensions.x, this.mapDimensions.y - 1);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
    this.ctx.stroke();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.mapDimensions.x, this.mapDimensions.y);
  }
}
