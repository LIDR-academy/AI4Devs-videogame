class RankingScene extends Phaser.Scene {
  constructor() {
    super({ key: "RankingScene" });
    this.currentSize = 3; // Default to Easy
    this.currentSort = "time"; // Default to Time rankings
  }

  create() {
    // Title
    this.add
      .text(400, 50, "RANKINGS", {
        fontSize: "48px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Create difficulty buttons
    this.createDifficultyTabs();

    // Create sorting buttons
    this.createSortingButtons();

    // Create back button
    this.createBackButton();

    // Show initial rankings
    this.showRankings();
  }

  createDifficultyTabs() {
    const difficulties = [
      { text: "EASY (3x3)", size: 3 },
      { text: "MEDIUM (4x4)", size: 4 },
      { text: "HARD (5x5)", size: 5 },
    ];

    difficulties.forEach((diff, index) => {
      const tab = this.add
        .text(200 + index * 200, 120, diff.text, {
          fontSize: "20px",
          fill: "#fff",
          backgroundColor:
            this.currentSize === diff.size ? "#1a5c1a" : "#000000",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .setOrigin(0.5);

      tab.on("pointerdown", () => {
        this.currentSize = diff.size;
        // Update all tabs
        difficulties.forEach((d, i) => {
          const otherTab = this.children.list.find(
            (child) => child.text === d.text
          );
          if (otherTab) {
            otherTab.setBackgroundColor(
              d.size === diff.size ? "#1a5c1a" : "#000000"
            );
          }
        });
        this.showRankings();
      });
    });
  }

  createSortingButtons() {
    const byTime = this.add
      .text(300, 170, "BY TIME", {
        fontSize: "24px",
        fill: "#fff",
        backgroundColor: this.currentSort === "time" ? "#1a5c1a" : "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive();

    const byMoves = this.add
      .text(500, 170, "BY MOVES", {
        fontSize: "24px",
        fill: "#fff",
        backgroundColor: this.currentSort === "moves" ? "#1a5c1a" : "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive();

    byTime.on("pointerdown", () => {
      this.currentSort = "time";
      byTime.setBackgroundColor("#1a5c1a");
      byMoves.setBackgroundColor("#000000");
      this.showRankings();
    });

    byMoves.on("pointerdown", () => {
      this.currentSort = "moves";
      byMoves.setBackgroundColor("#1a5c1a");
      byTime.setBackgroundColor("#000000");
      this.showRankings();
    });
  }

  createBackButton() {
    const backButton = this.add
      .text(400, 500, "BACK TO MENU", {
        fontSize: "24px",
        fill: "#fff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setInteractive()
      .setOrigin(0.5);

    backButton.on("pointerover", () => backButton.setStyle({ fill: "#0f0" }));
    backButton.on("pointerout", () => backButton.setStyle({ fill: "#fff" }));
    backButton.on("pointerdown", () => this.scene.start("MenuScene"));
  }

  showRankings() {
    // Clear existing ranking display
    if (this.rankingTexts) {
      this.rankingTexts.forEach((text) => text.destroy());
    }

    const rankings = this.getRankings();
    this.rankingTexts = [];

    // Display rankings
    rankings.forEach((rank, index) => {
      const text = this.add
        .text(
          400,
          250 + index * 40,
          `#${index + 1}  ${this.formatScore(rank)}  ${rank.date}`,
          {
            fontSize: "24px",
            fill: "#fff",
          }
        )
        .setOrigin(0.5);

      this.rankingTexts.push(text);
    });
  }

  getRankings() {
    const key = `rankings_${this.currentSize}_${this.currentSort}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  formatScore(rank) {
    if (this.currentSort === "time") {
      return rank.timeFormatted;
    } else {
      return `${rank.moves} moves`;
    }
  }
}
