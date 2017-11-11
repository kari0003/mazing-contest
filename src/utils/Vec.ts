import * as Types from './Types';

export type IVec2 = Types.IVec2;

export class Vec2 implements IVec2 {
  x: number;
  y: number;

  constructor(vec2: IVec2) {
    this.x = vec2.x;
    this.y = vec2.y;
  }

  add(vec2: IVec2) {
    return new Vec2({
      x: this.x + vec2.x,
      y: this.y + vec2.y,
    });
  }

  subtract(vec2: IVec2) {
    return new Vec2({
      x: this.x - vec2.x,
      y: this.y - vec2.y,
    });
  }

  multiply(vec2: IVec2) {
    return new Vec2({
      x: this.x * vec2.x,
      y: this.y * vec2.y,
    });
  }

  divide(vec2: IVec2) {
    if (vec2.x === 0 || vec2.y === 0) {
      throw new Error(`Dividing vector coordinates should not be 0: { x: ${vec2.x}, y: ${vec2.y}}`);
    }
    return new Vec2({
      x: this.x / vec2.x,
      y: this.y / vec2.y,
    });
  }

  scale(scale: number) {
    return new Vec2({
      x: this.x * scale,
      y: this.y * scale,
    });
  }
}
