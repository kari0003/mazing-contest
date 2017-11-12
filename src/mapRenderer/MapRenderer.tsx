import * as React from 'react';

import { Wall } from '../wall';
import { Vec2, IVec2 } from '../utils/Vec';
import { EventManager } from '../eventManager';

export interface IMapRendererProps {
  mapDimensions: IVec2;
  eventManager: EventManager;
  gameInfo: IGameInfo;
  volatile: {
    wallToBe?: Vec2;
    wallSuggestion?: Vec2 | null;
    origin?: Vec2;
  };
  path: IVec2[];
}
export interface IMapRendererState {}
interface IGameInfo {
  gameRef: string;
  mapTiles: IVec2;
  mapPathing: boolean[][];
  path: IVec2[];
  walls: Wall[];
}

export class MapRenderer extends React.Component<IMapRendererProps, IMapRendererState> {
  public mapDimensions: Vec2;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private gridSize: Vec2;

  constructor(props: IMapRendererProps) {
    super(props);
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

    this.drawTiles();
    this.drawPathing();
    this.drawGrid();
    this.drawWalls();
    this.drawVolatile();
  }

  drawPathing() {
    // Create gradient
    var grd = this.ctx.createLinearGradient(0, 0, 400, 50);
    grd.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
    grd.addColorStop(1, 'rgba(255, 64, 0, 0.3)');

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
      grd.addColorStop(0, 'teal');
      grd.addColorStop(1, 'green');

      // Fill with gradient
      this.ctx.fillStyle = grd;
      this.ctx.fillRect(tile.x * this.gridSize.x, tile.y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
    });
  }

  drawGrid() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#333333';
    for (let x = 0; x < this.props.gameInfo.mapTiles.x; x++) {
      this.drawLine(this.gridSize.x * x, 0, this.gridSize.x * x, this.mapDimensions.y);
    }
    this.drawLine(this.mapDimensions.x - 1, 0, this.mapDimensions.x - 1, this.mapDimensions.y);

    for (let y = 0; y < this.props.gameInfo.mapTiles.y; y++) {
      this.drawLine(0, this.gridSize.y * y, this.mapDimensions.x, this.gridSize.y * y);
    }
    this.drawLine(0, this.mapDimensions.y - 1, this.mapDimensions.x, this.mapDimensions.y - 1);
  }

  drawWalls() {
    for (let wall of this.props.gameInfo.walls) {
      this.drawWall(wall.pos);
    }
  }

  drawWall(pos: Vec2) {
    const center = pos.multiply(this.gridSize).add(this.gridSize).add({ x: 0.5, y: 0.5 });
    this.ctx.beginPath();
    this.ctx.ellipse(center.x, center.y, this.gridSize.x - 2, this.gridSize.y - 2, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
  }

  drawVolatile() {
    if (this.props.volatile.origin) {
      const origin = this.props.volatile.origin.multiply(this.gridSize).add({ x: 0.5, y: 0.5 });
      this.ctx.beginPath();
      this.ctx.arc(origin.x, origin.y, 2, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'red';
      this.ctx.fill();
    }
    // Draw Hover placement
    if (this.props.volatile.wallSuggestion || this.props.volatile.wallToBe) {
      const rectPos = this.props.volatile.wallSuggestion ?
        this.props.volatile.wallSuggestion.multiply(this.gridSize).add({ x: 0.5, y: 0.5 }) :
        this.props.volatile.wallToBe!.multiply(this.gridSize).add({ x: 0.5, y: 0.5 });
      if (this.props.volatile.wallSuggestion) {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'green';
      } else {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'red';
      }
      this.ctx.beginPath();
      this.ctx.rect(rectPos.x, rectPos.y, this.gridSize.x * 2, this.gridSize.y * 2);
      this.ctx.stroke();
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
    this.ctx.stroke();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.mapDimensions.x, this.mapDimensions.y);
  }
}
