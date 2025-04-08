// Game state
const gameState = {
  cards: [],
  flippedCards: [],
  moves: 0,
  matchedPairs: 0,
  timer: 0,
  timerInterval: null,
  isPlaying: false,
  gameStarted: false,
  currentLevel: 1,
  maxLevel: 3,
}

// Card emojis (you can replace these with images)
const cardEmojis = [
  "🎮",
  "🎲",
  "🎯",
  "🎨",
  "🎭",
  "🎪",
  "🎟️",
  "🎠",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "🎬",
  "🎨",
  "🎭",
  "🎪",
]

// Level configurations
const levelConfig = {
  1: { cards: 8, gridCols: 4 },
  2: { cards: 12, gridCols: 4 },
  3: { cards: 16, gridCols: 4 },
}

// Create audio context for beep sound
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

// Function to play beep sound
const playBeep = () => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5 note
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

  oscillator.start()
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1
  )
  oscillator.stop(audioContext.currentTime + 0.1)
}

// Function to play countdown sound
const playCountdown = () => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4 note
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)

  oscillator.start()
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.2
  )
  oscillator.stop(audioContext.currentTime + 0.2)
}

// Fireworks effect
const createFirework = (x, y) => {
  const colors = ["#ff0", "#f0f", "#0ff", "#f00", "#0f0"]
  const particles = 30

  for (let i = 0; i < particles; i++) {
    const particle = document.createElement("div")
    particle.className = "firework-particle"
    particle.style.left = x + "px"
    particle.style.top = y + "px"
    particle.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)]

    const angle = (i / particles) * Math.PI * 2
    const velocity = 2 + Math.random() * 2
    const vx = Math.cos(angle) * velocity
    const vy = Math.sin(angle) * velocity

    document.body.appendChild(particle)

    const animation = particle.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: `translate(${vx * 100}px, ${vy * 100}px) scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + Math.random() * 500,
        easing: "cubic-bezier(0,0,0.2,1)",
      }
    )

    animation.onfinish = () => particle.remove()
  }
}

const createFireworks = () => {
  const fireworks = 5
  for (let i = 0; i < fireworks; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      createFirework(x, y)
    }, i * 300)
  }
}

// DOM Elements
const gameBoard = document.getElementById("game-board")
const movesDisplay = document.getElementById("moves")
const timerDisplay = document.getElementById("timer")
const levelDisplay = document.getElementById("level")
const gameButton = document.getElementById("game-button")

// Initialize game
const initializeGame = () => {
  // Play countdown sound
  playCountdown()

  // Reset game state
  gameState.cards = []
  gameState.flippedCards = []
  gameState.moves = 0
  gameState.matchedPairs = 0
  gameState.timer = 0
  gameState.isPlaying = false
  gameState.gameStarted = false

  // Clear timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval)
  }

  // Update displays
  movesDisplay.textContent = "0"
  timerDisplay.textContent = "0:00"
  levelDisplay.textContent = gameState.currentLevel

  // Update grid layout based on level
  const config = levelConfig[gameState.currentLevel]
  gameBoard.className = `grid gap-2 w-full transition-all duration-300 grid-cols-2 md:grid-cols-${config.gridCols}`

  // Create and shuffle cards
  const cardPairs = cardEmojis.slice(0, config.cards / 2)
  const cardPairsDoubled = [...cardPairs, ...cardPairs]
  gameState.cards = shuffleArray(cardPairsDoubled)

  // Render cards
  renderCards()

  // Update button state
  gameButton.textContent = "Start Game"
  gameButton.disabled = false
}

// Handle game button click
const handleGameButton = () => {
  if (!gameState.gameStarted) {
    startGame()
  } else {
    initializeGame()
  }
}

// Start game
const startGame = () => {
  gameState.gameStarted = true
  gameButton.textContent = "Reset Game"
  startTimer()
}

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Render cards to the game board
const renderCards = () => {
  gameBoard.innerHTML = ""
  gameState.cards.forEach((emoji, index) => {
    const card = createCardElement(emoji, index)
    gameBoard.appendChild(card)
  })
}

// Create card element
const createCardElement = (emoji, index) => {
  const card = document.createElement("div")
  card.className = "memory-card"
  card.dataset.index = index
  card.dataset.emoji = emoji

  card.innerHTML = `
        <div class="memory-card-inner">
            <div class="memory-card-front">${emoji}</div>
            <div class="memory-card-back"></div>
        </div>
    `

  card.addEventListener("click", handleCardClick)
  return card
}

// Handle card click
const handleCardClick = (event) => {
  if (!gameState.gameStarted) return

  const card = event.currentTarget

  // Prevent clicking if card is already flipped or matched
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    gameState.flippedCards.length >= 2
  ) {
    return
  }

  // Flip card
  card.classList.add("flipped")
  gameState.flippedCards.push(card)

  // Check for match if two cards are flipped
  if (gameState.flippedCards.length === 2) {
    gameState.moves++
    movesDisplay.textContent = gameState.moves
    checkMatch()
  }
}

// Check if flipped cards match
const checkMatch = () => {
  const [card1, card2] = gameState.flippedCards
  const match = card1.dataset.emoji === card2.dataset.emoji

  if (match) {
    handleMatch(card1, card2)
  } else {
    handleMismatch(card1, card2)
  }
}

// Handle matching cards
const handleMatch = (card1, card2) => {
  card1.classList.add("matched")
  card2.classList.add("matched")
  gameState.matchedPairs++

  // Play beep sound when cards match
  playBeep()

  // Check if game is complete
  const config = levelConfig[gameState.currentLevel]
  if (gameState.matchedPairs === config.cards / 2) {
    endGame()
  }

  resetFlippedCards()
}

// Handle mismatched cards
const handleMismatch = (card1, card2) => {
  setTimeout(() => {
    card1.classList.remove("flipped")
    card2.classList.remove("flipped")
    resetFlippedCards()
  }, 1000)
}

// Reset flipped cards array
const resetFlippedCards = () => {
  gameState.flippedCards = []
}

// Start game timer
const startTimer = () => {
  gameState.timerInterval = setInterval(() => {
    gameState.timer++
    const minutes = Math.floor(gameState.timer / 60)
    const seconds = gameState.timer % 60
    timerDisplay.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`
  }, 1000)
}

// Show level progression modal
const showLevelProgressionModal = () => {
  const modal = document.createElement("div")
  modal.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  modal.innerHTML = `
    <div class="bg-white p-8 rounded-lg text-center max-w-md w-full mx-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
      <p class="text-xl text-gray-600 mb-6">You completed Level ${
        gameState.currentLevel
      }!</p>
      ${
        gameState.currentLevel < gameState.maxLevel
          ? `
        <p class="text-lg text-gray-700 mb-6">Would you like to proceed to Level ${
          gameState.currentLevel + 1
        }?</p>
        <div class="flex justify-center gap-4">
          <button id="next-level" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
            Next Level
          </button>
          <button id="restart" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
            Restart
          </button>
        </div>
      `
          : `
        <p class="text-lg text-gray-700 mb-6">You've completed all levels!</p>
        <button id="restart" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
          Play Again
        </button>
      `
      }
    </div>
  `
  document.body.appendChild(modal)

  // Add event listeners to buttons
  const nextLevelBtn = document.getElementById("next-level")
  const restartBtn = document.getElementById("restart")

  if (nextLevelBtn) {
    nextLevelBtn.addEventListener("click", () => {
      gameState.currentLevel++
      modal.remove()
      initializeGame()
      // Automatically start the game when moving to next level
      startGame()
    })
  }

  restartBtn.addEventListener("click", () => {
    gameState.currentLevel = 1
    modal.remove()
    initializeGame()
  })
}

// End game
const endGame = () => {
  clearInterval(gameState.timerInterval)
  gameState.isPlaying = false

  // Save high score to localStorage
  const highScore = localStorage.getItem("memoryHighScore")
  if (!highScore || gameState.moves < parseInt(highScore)) {
    localStorage.setItem("memoryHighScore", gameState.moves)
  }

  // Create fireworks effect
  createFireworks()

  // Show level progression modal after fireworks
  setTimeout(() => {
    showLevelProgressionModal()
  }, 500)
}

// Event Listeners
gameButton.addEventListener("click", handleGameButton)

// Initialize game on load
initializeGame()
