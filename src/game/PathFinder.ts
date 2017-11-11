import * as _ from 'lodash';
import { IVec2 } from '../utils/Types';

export interface IPathing {
  startPoint: IVec2;
  endPoint: IVec2;
  size: IVec2;
  pathingMatrix: boolean[][];
}

export class PathFinder {
  static findPath(pathing: IPathing): IVec2[] {
    const path: IVec2[] = [];
    const lengthMatrix: (number)[][] = [];
    for (let x = 0; x < pathing.size.x; x++) {
      lengthMatrix[x] = [];
      for (let y = 0; y < pathing.size.y; y++) {
        lengthMatrix[x][y] = -1;
      }
    }
    lengthMatrix[pathing.startPoint.x][pathing.startPoint.y] = 0;
    const visitHistory: IVec2[] = [];
    visitHistory.push(pathing.startPoint);
    while (lengthMatrix[pathing.endPoint.x][pathing.endPoint.y] < 0 || !visitHistory.length) {
      const current = visitHistory.splice(0, 1)[0];
      const currentValue = lengthMatrix[current.x][current.y];
      const neighbours = PathFinder.getNeighbours(current, pathing);
      _.forEach(neighbours, function(next: IVec2) {
        if ((currentValue + 1) < lengthMatrix[next.x][next.y] || lengthMatrix[next.x][next.y]  === -1) {
          lengthMatrix[next.x][next.y] = currentValue + 1;
          const exists = _.find(visitHistory, (node) => _.isEqual(next, node));
          if (!exists) {
            visitHistory.push(next);
          }
        }
      });
      if (!visitHistory.length && lengthMatrix[pathing.endPoint.x][pathing.endPoint.y] < 0) {
        throw new Error('impossible maze');
      }
    }
    path[0] = pathing.endPoint;
    while (!_.isEqual(pathing.startPoint, path[0])) {
      const current = path[0];
      const currentValue = lengthMatrix[current.x][current.y];
      const neighbours = PathFinder.getNeighbours(current, pathing);
      const previous = neighbours.find(next => lengthMatrix[next.x][next.y] === currentValue - 1);
      if (!previous) {
        throw new Error('Somthinz wrong hrer');
      }
      path.unshift(previous);
    }
    return path;
  }

  static getNeighbours(current: IVec2, pathing: IPathing) {
    const neighbours: IVec2[] = [];
    if (current.x > 0 && pathing.pathingMatrix[current.x - 1][current.y]) {
        neighbours.push({ x: current.x - 1, y: current.y });
    }
    if (current.y > 0 && pathing.pathingMatrix[current.x][current.y - 1]) {
        neighbours.push({ x: current.x, y: current.y - 1 });
    }
    if (current.x < (pathing.size.x - 1) && pathing.pathingMatrix[current.x + 1][current.y]) {
        neighbours.push({ x: current.x + 1, y: current.y });
    }
    if (current.y < (pathing.size.y - 1) && pathing.pathingMatrix[current.x][current.y + 1]) {
        neighbours.push({ x: current.x, y: current.y + 1 });
    }
    return neighbours;
  }

}
