import { Vec2 } from '../utils/Vec';
import { Game } from '../game';

export class EventManager {
  private canvas: HTMLCanvasElement;

  constructor(private ref: Game) {
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  mount(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('selectstart', this.onSelectEvent);
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseDown(event: MouseEvent) {
    // console.log('mouse down');
  }
  onMouseUp(event: MouseEvent) {
    // console.log('mouse up');
  }
  onMouseMove(event: MouseEvent) {
    const coord = new Vec2(this.getEventCoords(event as MouseEvent));
    // console.log('mouse move');
    this.ref.hoverWall(coord);
  }
  onClick(event: MouseEvent) {
    // console.log('clicked');
    this.ref.handleClick(event);
  }
  onDoubleClick(event: MouseEvent) {
    console.log('doubleclicked');
  }
  onKeyDown() {
    console.log('key pressed');
  }

  // tslint:disable-next-line:no-any
  onSelectEvent(e: any) {
    const event = e as MouseEvent;
    // console.log('on select');
    event.stopPropagation();
    return false;
  }

  getEventCoords(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const coords = {
      x: Math.round((event.clientX - rect.left) / ( rect.right - rect.left) *  this.canvas.width),
      y: Math.round((event.clientY - rect.top) / ( rect.bottom - rect.top) *  this.canvas.height)
    };
    return coords;
  }
}
