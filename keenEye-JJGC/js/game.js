class Game {
  constructor() {
    this.score = 0;
    this.currentRound = 0;
    this.timer = null;
    this.timeLeft = CONFIG.TIME_LIMIT;
    this.isPlaying = false;
    this.images = [];

    // DOM elements
    this.startScreen = document.getElementById("start-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.mainImage = document.getElementById("main-image");
    this.options = document.querySelectorAll(".option");
    this.timerElement = document.getElementById("timer");
    this.scoreElement = document.getElementById("score");
    this.finalScoreElement = document.getElementById("final-score");

    // Bind event listeners
    this.startButton = document.getElementById("start-button");
    this.restartButton = document.getElementById("restart-button");
    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () =>
      this.resetAndStartGame()
    );

    // Bind option click handlers
    this.options.forEach((option) => {
      option.addEventListener("click", (e) => this.handleOptionClick(e));
    });
  }

  async startGame() {
    this.score = 0;
    this.currentRound = 0;
    this.updateScore();

    // Skip showing the start screen since we're already on it
    // Just fade it out and show the game screen
    await Animations.fadeOut(this.startScreen);
    await Animations.fadeIn(this.gameScreen);
    await this.startRound();
  }

  async startRound() {
    if (this.currentRound >= CONFIG.ROUNDS) {
      await this.endGame();
      return;
    }

    // Make sure timer is stopped from previous round
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Reset timer state but don't start it yet
    this.isPlaying = false; // Will be set to true after images are loaded
    this.timeLeft = CONFIG.TIME_LIMIT;
    this.updateTimer();

    // Reset all options before loading new images
    this.options.forEach((option) => {
      const img = option.querySelector("img");
      if (img) {
        img.style.display = "block"; // Make sure image is visible
        img.src = ""; // Clear the source
        option.classList.remove("selected", "correct", "incorrect");
        option.style.pointerEvents = "auto";
      }
    });

    console.log(`Starting round ${this.currentRound + 1}`);

    // Load and display images for the current round
    const roundImages = CONFIG.IMAGE_ROUNDS[this.currentRound];
    await this.loadImages(roundImages);
    await this.displayImages(roundImages);

    // Add a small delay before starting the timer
    // This ensures all images are fully rendered and UI is updated
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Now that everything is loaded, start the timer and enable play
    this.isPlaying = true;
    this.startTimer();
  }

  async loadImages(roundImages) {
    // Use local image paths and track the correct image
    this.images = roundImages.variations.map((path) => ({
      url: path,
      isCorrect: path === roundImages.main,
    }));
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async displayImages(roundImages) {
    console.log(`Displaying images for round ${this.currentRound + 1}`);

    // Create a copy of the images array and shuffle it
    const shuffledImages = [...this.images];
    this.shuffleArray(shuffledImages);

    // Display main image using the main image path for this round
    this.mainImage.src = roundImages.main;

    // Display options
    this.options.forEach((option, index) => {
      const img = option.querySelector("img");
      if (img) {
        img.style.display = "block"; // Ensure image is visible
        img.src = shuffledImages[index].url;
        option.dataset.isCorrect = shuffledImages[index].isCorrect;
        option.classList.remove("selected", "correct", "incorrect");
        option.style.pointerEvents = "auto";
      }
    });

    // Log current image sources for debugging
    console.log("Main image:", this.mainImage.src);
    console.log(
      "Option images:",
      [...this.options].map((o) => o.querySelector("img")?.src)
    );

    try {
      // Wait for all images to load with a timeout
      const loadPromises = [
        new Promise((resolve, reject) => {
          if (this.mainImage.complete) resolve();
          else {
            this.mainImage.onload = resolve;
            this.mainImage.onerror = () =>
              reject(new Error("Failed to load main image"));
          }

          // Add timeout safety
          setTimeout(() => {
            if (!this.mainImage.complete) {
              console.warn("Main image load timed out, continuing anyway");
              resolve();
            }
          }, 2000);
        }),
        ...Array.from(this.options).map(
          (option, idx) =>
            new Promise((resolve, reject) => {
              const img = option.querySelector("img");
              if (img) {
                if (img.complete) resolve();
                else {
                  img.onload = resolve;
                  img.onerror = () => {
                    console.error(`Failed to load option image ${idx + 1}`);
                    resolve(); // Still resolve to allow game to continue
                  };
                }

                // Add timeout safety
                setTimeout(() => {
                  if (img && !img.complete) {
                    console.warn(
                      `Option image ${
                        idx + 1
                      } load timed out, continuing anyway`
                    );
                    resolve();
                  }
                }, 2000);
              } else {
                resolve();
              }
            })
        ),
      ];

      await Promise.all(loadPromises);
      console.log(
        "All images loaded successfully for round",
        this.currentRound + 1
      );
    } catch (error) {
      console.error("Error loading images:", error);
      // Continue anyway to avoid blocking the game
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimer();
      } else {
        this.handleTimeUp();
      }
    }, 1000);
  }

  updateTimer() {
    this.timerElement.textContent = this.timeLeft;

    // Get the parent element containing both the timer and the "s" for seconds
    const timerContainer = this.timerElement.parentElement;

    // Add warning animation when time is running out (2 seconds or less)
    if (this.timeLeft <= 2) {
      // Add the timer-warning class to the entire timer container
      timerContainer.classList.add("timer-container-warning");

      // Also add the warning class to the timer digit
      this.timerElement.classList.add("timer-warning");

      // Find the "s" text and make it red
      const secondsText = timerContainer.childNodes[1];
      if (secondsText && secondsText.nodeType === Node.TEXT_NODE) {
        // If it's a text node, wrap it in a span
        const span = document.createElement("span");
        span.textContent = secondsText.textContent;
        span.classList.add("timer-warning");
        secondsText.replaceWith(span);
      }

      // Increase animation intensity as time gets closer to zero
      // The less time remaining, the faster and more intense the animation
      const animationSpeed =
        this.timeLeft === 0 ? "0.15s" : this.timeLeft === 1 ? "0.2s" : "0.3s";

      const scale =
        this.timeLeft === 0 ? "1.3" : this.timeLeft === 1 ? "1.2" : "1.1";

      timerContainer.style.animationDuration = animationSpeed;

      // If we haven't created the heartbeat sound yet, create it
      if (!this.tickSound) {
        this.tickSound = new Audio();
        this.tickSound.src =
          "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
        this.tickSound.volume = 0.3;
      }

      // Play the tick sound if not already playing
      // Adjust playback rate based on time left
      if (this.tickSound && (this.tickSound.paused || this.tickSound.ended)) {
        this.tickSound.playbackRate =
          this.timeLeft === 0 ? 2.0 : this.timeLeft === 1 ? 1.5 : 1.0;
        this.tickSound
          .play()
          .catch((e) => console.log("Failed to play tick sound:", e));
      }
    } else {
      // Remove the warning classes if time is more than 2 seconds
      timerContainer.classList.remove("timer-container-warning");
      this.timerElement.classList.remove("timer-warning");

      // Reset animation duration
      timerContainer.style.animationDuration = "";

      // Check for all spans with timer-warning and remove the class
      const warningSpans = timerContainer.querySelectorAll(".timer-warning");
      warningSpans.forEach((span) => {
        span.classList.remove("timer-warning");
      });

      // Stop the tick sound if it's playing
      if (this.tickSound && !this.tickSound.paused) {
        this.tickSound.pause();
        this.tickSound.currentTime = 0;
      }
    }
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
  }

  async handleOptionClick(event) {
    if (!this.isPlaying) return;

    // Immediately stop the game and timer
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    const option = event.currentTarget;
    const isCorrect = option.dataset.isCorrect === "true";

    // IMPORTANT: Save the image element info before animation
    let savedImgSrc = "";
    let savedImgAlt = "";
    const imgElement = option.querySelector("img");
    if (imgElement) {
      savedImgSrc = imgElement.src;
      savedImgAlt = imgElement.alt || "Option image";
      console.log("Saved image info:", savedImgSrc);
    }

    // Disable all options
    this.options.forEach((opt) => (opt.style.pointerEvents = "none"));

    // Clean up any timer-related effects
    this.cleanupTimerEffects();

    // Show feedback
    if (isCorrect) {
      option.classList.add("correct");
      this.score += CONFIG.SCORE_INCREMENT;
      await Animations.showConfetti(option);
    } else {
      option.classList.add("incorrect");
      await Animations.showBomb(option);
    }

    // IMPORTANT: Restore the image after animation
    // The animation methods in animations.js clear the element's innerHTML
    if (savedImgSrc) {
      console.log("Restoring image after animation");
      const newImg = document.createElement("img");
      newImg.src = savedImgSrc;
      newImg.alt = savedImgAlt;
      newImg.style.display = "block"; // Make sure it's visible
      option.appendChild(newImg);
    }

    this.updateScore();

    // Wait for feedback animation
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.FEEDBACK_DURATION)
    );

    // Move to next round
    this.currentRound++;
    await this.startRound();
  }

  handleTimeUp() {
    if (!this.isPlaying) return;

    // Stop the game and timer
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Clean up any timer-related effects
    this.cleanupTimerEffects();

    this.updateScore();

    console.log("Time up! Moving to next round.");

    // Move to next round
    this.currentRound++;

    // Add a short delay before starting the next round
    // This helps prevent visual glitches during transitions
    setTimeout(() => {
      this.startRound();
    }, 100);
  }

  async endGame() {
    // Clean up any timer-related effects
    this.cleanupTimerEffects();

    await Animations.fadeOut(this.gameScreen);
    this.finalScoreElement.textContent = this.score + " / " + CONFIG.ROUNDS;
    await Animations.fadeIn(this.gameOverScreen);
  }

  async showScreen(screen) {
    await Animations.fadeOut(this.startScreen);
    await Animations.fadeOut(this.gameScreen);
    await Animations.fadeOut(this.gameOverScreen);
    await Animations.fadeIn(screen);
  }

  // Helper method to clean up timer effects
  cleanupTimerEffects() {
    // Remove timer warning class
    if (this.timerElement) {
      const timerContainer = this.timerElement.parentElement;

      // Remove warning classes
      this.timerElement.classList.remove("timer-warning");
      timerContainer.classList.remove("timer-container-warning");

      // Reset animation styles
      timerContainer.style.animationDuration = "";

      // Clean up any warning spans
      const warningSpans = timerContainer.querySelectorAll(".timer-warning");
      warningSpans.forEach((span) => {
        span.classList.remove("timer-warning");
      });
    }

    // Remove screen flash if it exists from previous implementation
    const flash = document.querySelector(".time-warning-flash");
    if (flash) {
      flash.remove();
    }

    // Stop tick sound
    if (this.tickSound && !this.tickSound.paused) {
      this.tickSound.pause();
      this.tickSound.currentTime = 0;
    }
  }

  // Method for handling "Play Again" button
  async resetAndStartGame() {
    console.log("Resetting game and restoring all images");

    // Clear any timers
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Clean up any timer-related effects
    this.cleanupTimerEffects();

    // Reset game state
    this.score = 0;
    this.currentRound = 0;
    this.isPlaying = false;
    this.updateScore();

    // IMPORTANT: Check each option and restore images that might be missing
    const options = document.querySelectorAll(".option");
    options.forEach((option, index) => {
      // Remove any feedback classes
      option.classList.remove("correct", "incorrect");

      // Check if the option is missing its image
      const img = option.querySelector("img");
      if (!img) {
        console.log(`Option ${index} is missing its image, restoring it`);

        // Create a new image element
        const newImg = document.createElement("img");
        newImg.alt = `Option ${index + 1}`;
        newImg.style.display = "block";

        // Append the image to the option
        option.appendChild(newImg);
      }

      // Reset pointer events and other styles
      option.style.pointerEvents = "auto";
      option.style.cursor = "pointer";
    });

    // Transition to game screen
    await Animations.fadeOut(this.gameOverScreen);
    await Animations.fadeIn(this.gameScreen);

    // Start the first round
    await this.startRound();
  }
}
