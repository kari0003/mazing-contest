import * as React from 'react';
import * as _ from 'lodash';

import { IVec2 } from '../utils/Types';
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
  public path: IVec2[] = [];
  public pathing: boolean[][] = [];

  rendererProps: IMapRendererProps;

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
    console.log(event.clientX, event.clientY);
    const coords = this.eventManager.getEventCoords(event as MouseEvent);
    this.handleGameEvent(coords);
    this.path = this.findPathing();
    this.setState({ invalidMaze: this.path.length === 0 });
    return;
  }

  render () {
    return (
      <div className="Game">
        <span><MapRenderer
          mapDimensions={{ x: this.size, y: this.size }}
          gameInfo={{
            gameRef: this.gameRef,
            mapTiles: this.gridSize,
            mapPathing: this.pathing,
            path: this.path,
          }}
          eventManager={this.eventManager}
          path={this.path}
        /></span>
        <h2>{this.state.invalidMaze ? 'The maze is invalid!' : 'Valid Maze'}</h2>
        <h3>{`Path length: ${this.path.length}.`}</h3>
      </div>
    );
  }

  handleGameEvent(coord: IVec2) {
    const x = Math.floor(coord.x / this.gridLength.x);
    const y = Math.floor(coord.y / this.gridLength.y);

    if (_.find(this.redtiles, c => _.isEqual(c, { x, y }))) {
      _.remove(this.redtiles, { x, y });
      this.pathing[x][y] = true;
    } else {
      this.redtiles.push({ x, y });
      this.pathing[x][y] = false;
    }
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
