import * as React from 'react';
import * as _ from 'lodash';
import './Game.css';

import { IVec2, Vec2 } from '../utils/Vec';
import { Wall } from '../wall';
import { PathFinder } from './PathFinder';
import { EventManager } from '../eventManager';
import { MapRenderer, IMapRendererProps } from '../mapRenderer';

export interface IGameProps {
  gameRef: string;
  size: number;
}

export interface IGameState {
  invalidMaze: boolean;
  renderTick: number;
}

export class Game extends React.Component<IGameProps, IGameState> {
  public gameRef: string;
  public size: number;

  public gridSize = {
    x: 16,
    y: 16,
  };
  public gridLength: IVec2 = { x: 30, y: 30 };

  public redtiles: IVec2[] = [];
  public walls: Wall[] = [];
  public path: IVec2[] = [];
  public pathing: boolean[][] = [];

  rendererProps: IMapRendererProps;

  volatile: {
    wallToBe?: Vec2;
    wallSuggestion?: Vec2 | null;
    origin?: Vec2;
  } = {};

  private eventManager: EventManager;

  constructor(props: IGameProps) {
    super(props);
    this.state = {
      invalidMaze: false,
      renderTick: 0,
    };
    this.gameRef = props.gameRef;
    this.size = props.size;
    this.gridLength = {
      x: this.size / this.gridSize.x,
      y: this.size / this.gridSize.y,
    };
    for (let x = 0; x < this.gridSize.x; x++) {
      this.pathing[x] = [];
      for (let y = 0; y < this.gridSize.y; y++) {
        this.pathing[x][y] = true;
      }
    }

    this.eventManager = new EventManager(this);
  }

  handleClick (event: {clientX: number, clientY: number}) {
    const coords = this.eventManager.getEventCoords(event as MouseEvent);
    this.handleGameEvent(coords);
    this.path = this.findPathing();
    this.setState({ invalidMaze: this.path.length === 0 });
    return;
  }

  render () {
    return (
      <div className="Game">
        <p>Click on the grid to create a maze</p>
        <span><MapRenderer
          mapDimensions={{ x: this.size, y: this.size }}
          gameInfo={{
            gameRef: this.gameRef,
            mapTiles: this.gridSize,
            mapPathing: this.pathing,
            walls: this.walls,
            path: this.path,
          }}
          volatile={this.volatile}
          eventManager={this.eventManager}
          path={this.path}
        /></span>
        <h2>{this.state.invalidMaze ? 'The maze is invalid!' : 'Valid Maze'}</h2>
        <h3>{`Path length is ${this.path.length}.`}</h3>
      </div>
    );
  }

  componentDidMount() {
    this.path = this.findPathing();
    this.setState({ invalidMaze: this.path.length === 0 });
  }

  handleGameEvent(coord: IVec2) {

    const gridCoord = new Vec2(coord).divide(this.gridLength);
    const suggestion = Wall.getSophisticatedWallPlacement(this.pathing, gridCoord);
    if (!suggestion) {
      return;
    }
    const {x, y} = suggestion;
    const old = false;
    if (old) {
      if (_.find(this.redtiles, c => _.isEqual(c, { x, y }))) {
        _.remove(this.redtiles, { x, y });
        this.pathing[x][y] = true;
      } else {
        this.redtiles.push({ x, y });
        this.pathing[x][y] = false;
      }
    } else {
      for (let wall of this.walls) {
        if (_.isEqual({ x: wall.pos.x, y: wall.pos.y }, {x, y})) {
          this.pathing = wall.clearPathing(this.pathing);
          _.remove(this.walls, wall);
          return;
        }
      }
      if (Wall.checkPathing(this.pathing, {x, y})) {
        const wall = new Wall({x, y});
        this.pathing = wall.applyPathing(this.pathing);
        this.walls.push(wall);
      }
    }
  }

  hoverWall(mousePos: Vec2) {
    const gridPos = mousePos.divide(this.gridLength);
    this.volatile.wallSuggestion = Wall.getSophisticatedWallPlacement(this.pathing, gridPos);
    this.volatile.wallToBe = gridPos.apply(Math.round).subtract({x: 1, y: 1});
    this.setState({ invalidMaze: this.path.length === 0 });
  }

  findPathing() {
    try {
      const path = PathFinder.findPath({
        pathingMatrix: this.pathing,
        size: this.gridSize,
        startPoint: { x: 8, y: 0 },
        endPoint: { x: 8, y: 15 },
      });
      return path;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
