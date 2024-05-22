import { CelestialBody } from "../celestialBody/index";

export class Asteroid extends CelestialBody {
  vx: number;
  vy: number;
  lives: number;
  trajectory: { x: number; y: number }[];
  energyLoss: number;
  speed: number;
  trajectoryChanged: boolean;
  canvasWidth: number;
  canvasHeight: number;
  cor: number;
  friction: number;
  color: string;
  forces: { x: number; y: number };
  dies: string;
  belowThresholdTime: number | null;
  mass: number;
  constructor(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    radius: number,
    vx = 0,
    vy = 0,
    speed: number,
    imageSrc = "../dist/assets/images/asteroid.png"
  ) {
    super(x, y, radius, imageSrc);
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.lives = 1;
    this.trajectory = [];
    this.energyLoss = 0.95;
    this.speed = speed;
    this.trajectoryChanged = false;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.cor = 0.7;
    this.mass = 2;
    this.friction = 0.95;
    this.color = this.generateRandomColor();
    this.forces = { x: 0, y: 0 };
    this.dies = "";
    this.belowThresholdTime = null;
  }

  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  move(gravity: boolean): void {
    if (gravity) {
      this.vy += 0.4;
    } else {
      this.vx += this.forces.x / this.mass;
      this.vy += this.forces.y / this.mass;

      const maxSpeed = 3;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.trajectory.push({ x: this.x, y: this.y });

    if (this.trajectory.length > 100) {
      this.trajectory.splice(0, this.trajectory.length - 100);
    }

    this.checkEdge();
  }

  calculateGravitationalForce(planets: any[]): void {
    planets.forEach((planet) => {
      const force = planet.calculateGravitationalForce(this);
      this.forces.x += force.x;
      this.forces.y += force.y;
    });
  }

  checkEdge(): void {
    if (this.x - this.radius < 0 || this.x + this.radius > this.canvasWidth) {
      this.vx *= -0.6 * this.energyLoss;
      if (this.x - this.radius < 0) this.x = this.radius;
      else this.x = this.canvasWidth - this.radius;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > this.canvasHeight) {
      this.vy *= -0.6 * this.energyLoss;
      if (this.y - this.radius < 0) this.y = this.radius;
      else {
        this.y = this.canvasHeight - this.radius;
        this.vx *= this.friction;
      }
    }
  }

  checkCollision(otherAsteroid: Asteroid): void {
    const dx = otherAsteroid.x - this.x;
    const dy = otherAsteroid.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = this.radius + otherAsteroid.radius;
    if (distance < minDist) {
      const angle = Math.atan2(dy, dx);
      const targetX = this.x + Math.cos(angle) * minDist;
      const targetY = this.y + Math.sin(angle) * minDist;
      if (!this.trajectoryChanged && !otherAsteroid.trajectoryChanged) {
        if (otherAsteroid.vx.toFixed() !== "0" && otherAsteroid.vy.toFixed() !== "0") {
          const angle1 = Math.atan2(this.vy, this.vx);
          const angle2 = Math.atan2(otherAsteroid.vy, otherAsteroid.vx);
          const v1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          const v2 = Math.sqrt(otherAsteroid.vx * otherAsteroid.vx + otherAsteroid.vy * otherAsteroid.vy);

          this.vx = v1 * Math.cos(angle2);
          this.vy = v1 * Math.sin(angle2);
          otherAsteroid.vx = v2 * Math.cos(angle1);
          otherAsteroid.vy = v2 * Math.sin(angle1);
        }

        this.x = targetX - Math.cos(angle) * (this.radius + otherAsteroid.radius);
        this.y = targetY - Math.sin(angle) * (this.radius + otherAsteroid.radius);
        otherAsteroid.x = targetX + Math.cos(angle) * (this.radius + otherAsteroid.radius);

        this.vx *= this.energyLoss;
        this.vy *= this.energyLoss;
        otherAsteroid.vx *= this.energyLoss;
        otherAsteroid.vy *= this.energyLoss;

        this.trajectoryChanged = true;
        otherAsteroid.trajectoryChanged = true;
      } else {
        this.trajectoryChanged = false;
        otherAsteroid.trajectoryChanged = false;
      }
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    if (this.trajectory.length > 1) {
      context.beginPath();
      context.moveTo(this.trajectory[0].x, this.trajectory[0].y);
      for (let i = 1; i < this.trajectory.length; i++) {
        context.lineTo(this.trajectory[i].x, this.trajectory[i].y);
      }
      context.strokeStyle = this.color;
      context.stroke();
    }
  }
}
