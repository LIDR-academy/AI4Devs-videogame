const CONFIG = {
  // Game settings
  ROUNDS: 3,
  TIME_LIMIT: 4,
  SCORE_INCREMENT: 1,
  SCORE_DECREMENT: 1,

  // Image paths for each round
  IMAGE_ROUNDS: [
    {
      main: "img/monkey1.jpeg",
      variations: ["img/monkey1.jpeg", "img/monkey2.jpeg", "img/monkey3.jpeg"],
    },
    {
      main: "img/panda1.jpeg",
      variations: ["img/panda1.jpeg", "img/panda2.jpeg", "img/panda3.jpeg"],
    },
    {
      main: "img/croc1.jpeg",
      variations: ["img/croc1.jpeg", "img/croc2.jpeg", "img/croc3.jpeg"],
    },
  ],

  // Animation settings
  ANIMATION_DURATION: 500, // milliseconds
  CARD_FLIP_DURATION: 800, // milliseconds
  FEEDBACK_DURATION: 2000, // milliseconds - increased to allow explosion animation to complete
};
