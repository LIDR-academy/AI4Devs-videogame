class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    // Title
    const title = this.add
      .text(400, 150, "15 PUZZLE", {
        fontSize: "64px",
        fill: "#fff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Create difficulty buttons
    const buttonStyle = {
      fontSize: "24px",
      fill: "#fff",
      backgroundColor: "#000",
      padding: { x: 20, y: 10 },
    };

    const difficulties = [
      { text: "EASY (3x3)", size: 3 },
      { text: "MEDIUM (4x4)", size: 4 },
      { text: "HARD (5x5)", size: 5 },
      { text: "RANKINGS", size: 0 },
    ];

    difficulties.forEach((diff, index) => {
      const button = this.add
        .text(400, 300 + index * 60, diff.text, buttonStyle)
        .setOrigin(0.5)
        .setInteractive()
        .setPadding(10)
        .setStyle({ backgroundColor: "#000" });

      // Add hover effect
      button.on("pointerover", () => {
        button.setStyle({ fill: "#0f0" });
      });

      button.on("pointerout", () => {
        button.setStyle({ fill: "#fff" });
      });

      button.on("pointerdown", () => {
        if (diff.size === 0) {
          this.scene.start("RankingScene");
        } else {
          this.scene.start("GameScene", { size: diff.size });
        }
      });
    });
  }
}
