const DEFAULT_GRAVITY = 0.1;
const BIG_MASS_GRAVITY = 3.6743e-2;
const STRONG_GRAVITY = 1;
const BALL_REMOVAL_THRESHOLD = 0.1;
const SPEED = 2;
const ASTEROID_RADIUS = 20;
const SKY_OBJECT_RADIUS = 50;
const BELOW_THRESHOLD_TIME_MS = 500;
const GALAXY_OBJECT = {
  PLANET: "PLANET",
  BLACK_HALL: "BLACK_HALL",
  ASTEROID: "ASTEROID",
};
const PLANET_IMAGES = [
  "../dist/assets/images/planets/planet_1.png",
  "../dist/assets/images/planets/planet_2.png",
  "../dist/assets/images/planets/planet_3.png",
  "../dist/assets/images/planets/planet_4.png",
  "../dist/assets/images/planets/planet_5.png",
  "../dist/assets/images/planets/planet_6.png",
  "../dist/assets/images/planets/planet_7.png",
  "../dist/assets/images/planets/planet_8.png",
  "../dist/assets/images/planets/planet_9.png",
];

export {
  DEFAULT_GRAVITY,
  GALAXY_OBJECT,
  BIG_MASS_GRAVITY,
  BALL_REMOVAL_THRESHOLD,
  STRONG_GRAVITY,
  PLANET_IMAGES,
  SPEED,
  ASTEROID_RADIUS,
  SKY_OBJECT_RADIUS,
  BELOW_THRESHOLD_TIME_MS,
};
