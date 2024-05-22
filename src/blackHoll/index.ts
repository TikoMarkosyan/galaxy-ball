import type { Asteroid } from "src/asteroid/index.js";
import { CelestialBody } from "../celestialBody/index";
import { GALAXY_OBJECT, STRONG_GRAVITY } from "../constants/main";

export class BlackHoll extends CelestialBody {
  mass: number;
  constructor(x: number, y: number, radius: number, imageSources: string) {
    super(x, y, radius, imageSources);
    this.mass = 10000;
    this.radius = 70;
  }

  checkCollision(asteroid: {
    x: number;
    y: number;
    radius: number;
    lives: number;
    dies: string;
  }) {
    const dx = this.x - asteroid.x;
    const dy = this.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = this.radius + asteroid.radius;
    if (distance < minDist) {
      asteroid.lives--;
      asteroid.dies = GALAXY_OBJECT.BLACK_HALL;;
    }
  }

  calculateGravitationalForce(asteroid: Asteroid): { x: number; y: number } {
    const G = STRONG_GRAVITY;
    const dx = this.x - asteroid.x;
    const dy = this.y - asteroid.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);

    if (distance < this.radius + asteroid.radius) {
      return { x: 0, y: 0 };
    }

    const forceMagnitude = (G * this.mass * asteroid.mass) / distanceSquared;
    const forceX = (forceMagnitude * dx) / distance;
    const forceY = (forceMagnitude * dy) / distance;
    return { x: forceX, y: forceY };
  }
}
