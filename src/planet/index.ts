import type { Asteroid } from "src/asteroid/index.js";
import { CelestialBody } from "../celestialBody/index.js";
import { BIG_MASS_GRAVITY } from "../constants/main.js";

export class Planet extends CelestialBody {
  lives: number;
  mass: number;
  vx: number;
  vy: number;
  audioSmallBoom: HTMLAudioElement | null;
  constructor(x: number, y: number, radius: number, imageSources: string[]) {
    const randomIndex = Math.floor(Math.random() * imageSources.length);
    const randomImageSrc = imageSources[randomIndex];
    super(x, y, radius, randomImageSrc);
    this.lives = 5;
    this.mass = 4000;
    this.radius = 40;
    this.vx = 0;
    this.vy = 0;
    this.audioSmallBoom = document.getElementById("smallboom") as HTMLAudioElement;
  }

  checkCollision(asteroid: {
    x: number;
    y: number;
    radius: number;
    lives: number;
  }) {
    if(!this.audioSmallBoom) return;
    const dx = this.x - asteroid.x;
    const dy = this.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = this.radius + asteroid.radius;
    if (distance < minDist) {
      this.lives > 1 && this.audioSmallBoom.play();
      this.lives--;
      asteroid.lives--;
    }
  }

  calculateGravitationalForce(asteroid: Asteroid): { x: number; y: number } {
    const G = BIG_MASS_GRAVITY;
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
