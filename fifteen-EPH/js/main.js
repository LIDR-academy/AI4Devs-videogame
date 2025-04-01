const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#0a192f",
  scene: [MenuScene, GameScene, RankingScene],
  audio: {
    disableWebAudio: false,
  },
  input: {
    mouse: true,
  },
};

const game = new Phaser.Game(config);
