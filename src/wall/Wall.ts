import  { IVec2, Vec2 } from '../utils/Vec';

export class Wall {
  static pathing = [[false, false], [false, false]];
  public pos: Vec2;

  constructor(position: IVec2) {
    this.pos = new Vec2(position);
  }

  public applyPathing(mapPathing: boolean[][]) {
    for (let x = 0; x < Wall.pathing.length; x++) {
      for (let y = 0; y < Wall.pathing[x].length; y++) {
        mapPathing[this.pos.x + x][this.pos.y + y] = Wall.pathing[x][y];
      }
    }
    return mapPathing;
  }

  public clearPathing(mapPathing: boolean[][]) {
    for (let x = 0; x < Wall.pathing.length; x++) {
      for (let y = 0; y < Wall.pathing[x].length; y++) {
        mapPathing[this.pos.x + x][this.pos.y + y] = true;
      }
    }
    return mapPathing;
  }

  static checkPathing(mapPathing: boolean[][], pos: IVec2) {
    if (mapPathing.length < pos.x + Wall.pathing.length || pos.x < 0 || pos.y < 0) {
      return false;
    }
    let canPlace = true;
    for (let x = 0; x < Wall.pathing.length; x++) {
      for (let y = 0; y < Wall.pathing[x].length; y++) {
        if (!mapPathing[pos.x + x][pos.y + y]) {
          canPlace = false;
        }
      }
    }
    return canPlace;
  }

  static getSophisticatedWallPlacement(mapPathing: boolean[][], gridCoord: Vec2) {
    const nearestGrid = gridCoord.apply(Math.round).subtract({ x: 1, y: 1 });
    const origin = gridCoord.apply(Math.floor);
    const offsetModifier = origin.subtract(nearestGrid).subtract({ x: 1, y: 1 });
    if (Wall.checkPathing(mapPathing, nearestGrid)) {
      return nearestGrid;
    } else if (Wall.checkPathing(mapPathing, { x: origin.x, y: origin.y + offsetModifier.y })) {
      return new Vec2({ x: origin.x, y: origin.y + offsetModifier.y });
    } else if (Wall.checkPathing(mapPathing, { x: origin.x + offsetModifier.x, y: origin.y })) {
      return new Vec2({ x: origin.x + offsetModifier.x, y: origin.y });
    } else if (Wall.checkPathing(mapPathing, {
      x: origin.x + offsetModifier.x,
      y: origin.y + offsetModifier.y
    })) {
      return new Vec2({
        x: origin.x + offsetModifier.x,
        y: origin.y + offsetModifier.y
      });
    }
    return null;
  }
}
