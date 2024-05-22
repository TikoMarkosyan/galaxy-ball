import { Asteroid } from "./asteroid";
import { BlackHoll } from "./blackHoll";
import { Planet } from "./planet";
import {
  DEFAULT_GRAVITY,
  GALAXY_OBJECT,
  PLANET_IMAGES,
  BALL_REMOVAL_THRESHOLD,
  BELOW_THRESHOLD_TIME_MS,
} from "./constants/main";

interface ObjectCreatorData {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  speed: number;
  image?: string;
}

interface IBodies {
  x: number;
  y: number;
  radius: number;
  lives?: number;
  mass?: number;
  vx?: number;
  vy?: number;
  trajectory?: { x: number; y: number }[];
  isMoving?: boolean;
  energyLoss?: number;
  speed?: number;
  trajectoryChanged?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  cor?: number;
  friction?: number;
  color?: string;
  forces?: { x: number; y: number };
  dt?: number;
  dies?: string;
  belowThresholdTime?: number | null;
  canvas?: HTMLCanvasElement | null;
  generateRandomColor?(): string;
  move?(gravity: boolean): void;
  calculateGravitationalForce?(planets: Asteroid | Planet | BlackHoll[]): void;
  checkEdge?(): void;
  checkCollision(otherAsteroid: Asteroid | Planet | BlackHoll): void;
  draw(context: CanvasRenderingContext2D): void;
}

class Canvas {
  width: number;
  height: number;
  planetDestroyCount: number;
  bodies: IBodies[];
  gravity: number;
  cor: number;
  startX: number | null;
  startY: number | null;
  endX: number | null;
  endY: number | null;
  simpleGravity: boolean;
  BALL_REMOVAL_THRESHOLD: number;
  nameSpaceObject: string;
  audioFall: HTMLAudioElement;
  audioBoom: HTMLAudioElement;
  justForFun: HTMLAudioElement;
  checkbox: HTMLInputElement;
  remove: HTMLInputElement;
  radioChooseObject: NodeListOf<HTMLInputElement>;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.checkbox = document.getElementById(
      "buttomGravity"
    ) as HTMLInputElement;
    this.checkbox &&
      this.checkbox.addEventListener(
        "click",
        this.handleGravityClick.bind(this)
      );
    this.remove = document.getElementById("removeAll") as HTMLInputElement;
    this.remove.addEventListener("click", this.removeAll.bind(this));
    this.radioChooseObject = document.getElementsByName(
      "selection"
    ) as NodeListOf<HTMLInputElement>;
    this.radioChooseObject.forEach((button) => {
      button.addEventListener(
        "click",
        this.handleSpaceObjectCheckboxClick.bind(this)
      );
    });

    this.width = width;
    this.height = height;
    this.bodies = [];
    this.planetDestroyCount = 0;
    this.gravity = DEFAULT_GRAVITY;
    this.cor = 0.7;
    this.startX = null;
    this.startY = null;
    this.endX = null;
    this.endY = null;
    this.simpleGravity = true;
    this.nameSpaceObject = GALAXY_OBJECT.ASTEROID;
    this.audioBoom = document.getElementById("boom") as HTMLAudioElement;
    this.audioFall = document.getElementById("fall") as HTMLAudioElement;
    this.justForFun = document.getElementById("forfun") as HTMLAudioElement;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = height  - 80;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.setupEventListeners();
    this.updateRadioButtons();
    this.BALL_REMOVAL_THRESHOLD = BALL_REMOVAL_THRESHOLD;
  }

  checkCanOffGravity() {
    return this.bodies.filter(
      (obj) => obj instanceof BlackHoll || obj instanceof Planet
    ).length;
  }

  addBody(body: any) {
    this.bodies.push(body);
  }

  removeBody(body: IBodies) {
    if (body instanceof Planet) {
      this.planetDestroyCount++;
      this.audioBoom.play();
    }

    if (body instanceof Asteroid) {
      if (body.dies === GALAXY_OBJECT.BLACK_HALL) {
        this.audioFall.play();
      }
    }

    const index = this.bodies.indexOf(body);
    if (index !== -1) {
      this.bodies.splice(index, 1);
    }

    if (this.checkCanOffGravity() === 0) {
      this.checkbox.disabled = false;
    }
    this.updateRadioButtons();
    this.updatePlanetDestroyCountDisplay();
  }

  updatePlanetDestroyCountDisplay() {
    const countDisplay = document.getElementById("planetDestroyCount");
    if (countDisplay) {
      countDisplay.textContent = `Destroyed Planets: ${this.planetDestroyCount}`;
    }
  }

  checkLives(body: IBodies) {
    if (body?.lives !== undefined && body?.lives <= 0) {
      this.removeBody(body);
    }
  }

  checkBallMovement() {
    const currentTime = Date.now();
    this.bodies.forEach((body) => {
      this.checkLives(body);
      if (body instanceof Asteroid) {
        const speed: number = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
        if (+speed.toFixed() < this.BALL_REMOVAL_THRESHOLD) {
          if (!body.belowThresholdTime) {
            body.belowThresholdTime = currentTime;
          } else if (
            currentTime - body.belowThresholdTime >=
            BELOW_THRESHOLD_TIME_MS
          ) {
            this.removeBody(body);
          }
        } else {
          body.belowThresholdTime = null;
        }
        if (speed < this.BALL_REMOVAL_THRESHOLD) {
          this.removeBody(body);
        }
      }
    });
  }

  applyGravity() {
    this.bodies.forEach((body: IBodies) => {
      if (body instanceof Asteroid) {
        body.move(this.simpleGravity);
      }
    });
  }

  handleSpaceObjectCheckboxClick(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.nameSpaceObject = target.value;
    }
  }

  handleGravityClick(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.checkCanOffGravity() === 0) {
      this.checkbox.disabled = false;
      this.simpleGravity = !target.checked;
      this.updateRadioButtons();
      return;
    }

    this.checkbox.disabled = this.simpleGravity;
  }

  updateRadioButtons() {
    this.radioChooseObject.forEach((button: HTMLInputElement) => {
      button.disabled = this.simpleGravity;
      if (this.simpleGravity) {
        button.value === GALAXY_OBJECT.ASTEROID ? (button.checked = true) : null;
      }
    });
  }

  removeAll() {
    this.bodies = [];
    this.justForFun.play();
    this.checkbox.disabled = false;
    this.updateRadioButtons();
  }

  objectCreator(data: ObjectCreatorData) {
    if (this.nameSpaceObject === GALAXY_OBJECT.PLANET) {
      this.addBody(new Planet(data.x, data.y, data.radius, PLANET_IMAGES));
    } else if (this.nameSpaceObject === GALAXY_OBJECT.BLACK_HALL) {
      this.addBody(
        new BlackHoll(data.x, data.y, data.radius, "../dist/assets/images/blackhole.png")
      );
    } else if (this.nameSpaceObject === GALAXY_OBJECT.ASTEROID) {
      this.addBody(
        new Asteroid(
          data.canvas,
          data.x,
          data.y,
          data.radius,
          data.vx,
          data.vy,
          data.speed,
          data.image ?? "../dist/assets/images/asteroid.png"
        )
      );
    }

    if (this.checkCanOffGravity() > 0) {
      this.checkbox.disabled = true;
    }
  }

  update() {
    this.checkBallMovement();
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        if (bodyA instanceof Asteroid && bodyB instanceof Asteroid) {
          bodyA.checkCollision(bodyB as Asteroid);
        }

        if (
          (bodyA instanceof Planet || bodyA instanceof BlackHoll) &&
          bodyB instanceof Asteroid
        ) {
          (bodyA as Planet | BlackHoll).checkCollision(bodyB as Asteroid);
        }

        if (
          (bodyB instanceof Planet || bodyB instanceof BlackHoll) &&
          bodyA instanceof Asteroid
        ) {
          (bodyB as Planet | BlackHoll).checkCollision(bodyA as Asteroid);
        }
      }
    }

    const planets = this.bodies.filter((obj) => obj instanceof Planet);
    const BlackHolls = this.bodies.filter((obj) => obj instanceof BlackHoll);
    this.bodies.forEach((asteroid) => {
      if (asteroid instanceof Asteroid) {
        asteroid.calculateGravitationalForce(planets);
        asteroid.calculateGravitationalForce(BlackHolls);
        asteroid.vx += asteroid.forces.x / asteroid.mass;
        asteroid.vy += asteroid.forces.y / asteroid.mass;
        asteroid.move(this.simpleGravity);
      }
    });
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.bodies.forEach((body) => body.draw(this.context));
    this.drawArrow();
  }

  drawArrow(){
    if (
      this.endX !== null &&
      this.endY != null &&
      this.startX !== null &&
      this.startY !== null
    ) {
      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;

      const angle = Math.atan2(dy, dx);
      const arrowLength = 20;
      this.context.beginPath();
      this.context.moveTo(this.startX, this.startY);
      this.context.lineTo(this.endX, this.endY);
      this.context.moveTo(
        this.endX - arrowLength * Math.cos(angle - Math.PI / 6),
        this.endY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      this.context.lineTo(this.endX, this.endY);
      this.context.lineTo(
        this.endX - arrowLength * Math.cos(angle + Math.PI / 6),
        this.endY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      this.context.lineWidth = 2;
      this.context.strokeStyle = "blue";
      this.context.stroke();
      this.context.fill();
    }
  }

  getCoordinates(event: MouseEvent | TouchEvent) {
    let clientX, clientY;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return null;
    }

    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  handleStart(event: MouseEvent | TouchEvent) {
    const coords = this.getCoordinates(event);
    if (coords) {
      this.startX = coords.x;
      this.startY = coords.y;
      this.endX = this.startX;
      this.endY = this.startY;
    }
  }

  handleMove(event: MouseEvent | TouchEvent) {
    if (this.startX !== null && this.startY !== null) {
      const coords = this.getCoordinates(event);
      if (coords) {
        this.endX = coords.x;
        this.endY = coords.y;
      }
    }
  }

  handleEnd() {
    if (
      this.startX !== null &&
      this.startY !== null &&
      this.endX !== null &&
      this.endY !== null
    ) {
      const radius = 30;
      const x = this.startX;
      const y = this.startY;
      const vx = (this.endX - this.startX) / 10;
      const vy = (this.endY - this.startY) / 10;

      this.objectCreator({
        canvas: this.canvas,
        x,
        y,
        radius,
        vx,
        vy,
        speed: 2,
      });
    } else {
      const x = this.startX ?? 0;
      const y = this.startY ?? 0;
      if (this.canvas) {
        this.objectCreator({
          canvas: this.canvas,
          x,
          y,
          radius: 50,
          vx: 0,
          vy: 0,
          speed: 2,
        });
      }
    }
    this.startX = this.startY = this.endX = this.endY = null;
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleStart.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleEnd.bind(this));

    this.canvas.addEventListener("touchstart", this.handleStart.bind(this));
    this.canvas.addEventListener("touchmove", this.handleMove.bind(this));
    this.canvas.addEventListener("touchend", this.handleEnd.bind(this));
  }

  start() {
    lastTime = performance.now();
    requestAnimationFrame(tick);
  }
}


let lastTime: number;

function tick(currentTime: number) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update and draw the canvas
  canvas.update();
  canvas.draw();

  requestAnimationFrame(tick);
}


const canvas = new Canvas(window.innerWidth, window.innerHeight);

canvas.start();
