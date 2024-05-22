# GALAXY BALL

### npm start

Runs the app in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like [@snowpack/plugin-webpack](https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-webpack) or [snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) to your `snowpack.config.mjs` config file.

### Q: What about Eject?

No eject needed! Snowpack guarantees zero lock-in, and CSA strives for the same.

## Mechanic Game

Welcome to the Mechanic Game! This game features three objects: Asteroid, Planet, and Black Hole, each with unique interactions and behaviors.

### Getting Started

#### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

#### Installation

1. Clone the repository.
2. Navigate to the project directory.

```
npm install
```

### Building the Project
```
npm run build
```
### Starting the Game
```
npm start
```

## Gameplay Overview

### Objects
Asteroid: This is the default object. If the Galaxy mode is not enabled, you can only create asteroids. Asteroids behave like balls and can move.
Planet: Planets have gravity and lives. If five asteroids collide with a planet, the planet is destroyed. Planets do not move; they are static.
Black Hole: Black Holes are static and destroy any asteroid that touches them. They do not have lives.

### Galaxy Mode
By default, the Galaxy mode is disabled, and you can only create asteroids.
When the Galaxy mode is enabled, you can choose to create planets or black holes.
While in Galaxy mode, you cannot change the default object to asteroid.

### Creating Objects
Asteroid: Click and drag in the direction you want the asteroid to go. The length of the arrow determines the speed of the asteroid – longer arrows mean faster speeds, while shorter arrows mean slower speeds.
Planet and Black Hole: When Galaxy mode is enabled, you can select either a planet or a black hole and place them on the canvas. These objects remain static once placed.

### Game Mechanics
Asteroid Interactions:
If an asteroid collides with a planet, the planet's lives decrease. When the lives reach zero, the planet is destroyed.
If an asteroid collides with a black hole, the asteroid is destroyed.
Planet and Black Hole:
Planets and black holes do not move once placed on the canvas.
Planets have a gravitational field that affects the movement of asteroids.
Controls
Mouse Down: Start creating an asteroid.
Mouse Move: Adjust the direction and speed of the asteroid.
Mouse Up: Release to place the asteroid on the canvas.
Additional Features
Audio Feedback: Sound effects are played during collisions and other interactions.
UI Elements: Buttons and checkboxes to toggle Galaxy mode and select objects.
Enjoy exploring the mechanics of the game and creating your own galaxy!

### Screenshots
![screen1](https://github.com/TikoMarkosyan/galaxy-ball/blob/main/src/assets/images/screenshots/Screenshot1.png?raw=true)
![screen2](https://github.com/TikoMarkosyan/galaxy-ball/blob/main/src/assets/images/screenshots/Screenshot2.png?raw=true)
![screen3](https://github.com/TikoMarkosyan/galaxy-ball/blob/main/src/assets/images/screenshots/Screenshot3.png?raw=true)
