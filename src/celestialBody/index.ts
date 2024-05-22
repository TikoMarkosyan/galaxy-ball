export class CelestialBody {
    x: number;
    y: number;
    radius: number;
    image: HTMLImageElement;
    imageLoaded: boolean;
  
    constructor(x: number, y: number, radius: number, imageSrc: string) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.image = new Image();
      this.imageLoaded = false;
      this.image.src = imageSrc;
      this.image.onload = () => {
        this.imageLoaded = true;
      };
    }
  
    draw(context: CanvasRenderingContext2D): void {
      if (this.imageLoaded) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.clip();
        context.drawImage(
          this.image,
          this.x - this.radius,
          this.y - this.radius,
          this.radius * 2,
          this.radius * 2
        );
        context.restore();
      }
    }
  }
  