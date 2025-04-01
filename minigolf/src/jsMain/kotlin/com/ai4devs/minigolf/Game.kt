package com.ai4devs.minigolf

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.CanvasRenderingContext2D
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.HTMLElement
import org.w3c.dom.events.MouseEvent
import kotlin.math.*

class Game(private val canvas: HTMLCanvasElement) {
    private val ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    private var currentLevel = 1
    private var ball = Ball(0.0, 0.0)
    private var isAiming = false
    private var aimAngle = 0.0
    private var power = 15.0
    private var strokes = 0
    private var isMoving = false
    private var bestScores = mutableMapOf<Int, Int>()

    init {
        loadBestScores()
        setupEventListeners()
        loadLevel(currentLevel)
        gameLoop()
    }

    private fun loadBestScores() {
        val savedScores = window.localStorage.getItem("minigolf_scores")
        if (savedScores != null) {
            try {
                val scores = JSON.parse<dynamic>(savedScores)
                for (level in 1..10) {
                    if (scores[level] != undefined) {
                        bestScores[level] = scores[level]
                    }
                }
            } catch (e: Exception) {
                console.error("Error loading scores: ${e.message}")
            }
        }
    }

    private fun saveBestScores() {
        try {
            window.localStorage.setItem("minigolf_scores", JSON.stringify(bestScores))
        } catch (e: Exception) {
            console.error("Error saving scores: ${e.message}")
        }
    }

    private fun loadLevel(levelNumber: Int) {
        val level = Levels.allLevels.find { it.number == levelNumber }
            ?: throw IllegalStateException("Level $levelNumber not found")
        
        ball.reset(level.ballStart.x, level.ballStart.y)
        strokes = 0
        isMoving = false
        updateScore()
        updateLevelDisplay()
    }

    private fun setupEventListeners() {
        canvas.addEventListener("mousedown", { event ->
            if (!isMoving) {
                isAiming = true
                val rect = canvas.getBoundingClientRect()
                val mouseEvent = event as MouseEvent
                val mouseX = mouseEvent.clientX - rect.left
                val mouseY = mouseEvent.clientY - rect.top
                aimAngle = calculateAngle(mouseX, mouseY)
            }
        })

        canvas.addEventListener("mousemove", { event ->
            if (isAiming) {
                val rect = canvas.getBoundingClientRect()
                val mouseEvent = event as MouseEvent
                val mouseX = mouseEvent.clientX - rect.left
                val mouseY = mouseEvent.clientY - rect.top
                aimAngle = calculateAngle(mouseX, mouseY)
                power = minOf(30.0, sqrt(
                    (mouseX - ball.x) * (mouseX - ball.x) + 
                    (mouseY - ball.y) * (mouseY - ball.y)
                ) / 5.0)
            }
        })

        canvas.addEventListener("mouseup", { _ ->
            if (isAiming) {
                isAiming = false
                shoot()
            }
        })
    }

    private fun calculateAngle(mouseX: Double, mouseY: Double): Double {
        val dx = mouseX - ball.x
        val dy = mouseY - ball.y
        return kotlin.math.atan2(dy, dx)
    }

    private fun shoot() {
        isMoving = true
        ball.velocityX = cos(aimAngle) * power
        ball.velocityY = sin(aimAngle) * power
        strokes++
        updateScore()
    }

    private fun updateScore() {
        val scoreElement = document.getElementById("score") as HTMLElement?
        val level = Levels.allLevels.find { it.number == currentLevel }
        val parText = level?.let { " (Par: ${it.par})" } ?: ""
        scoreElement?.textContent = "Level $currentLevel - Strokes: $strokes$parText"
    }

    private fun updateLevelDisplay() {
        val levelElement = document.getElementById("level") as HTMLElement?
        levelElement?.textContent = "Level $currentLevel"
    }

    private fun gameLoop() {
        if (isMoving) {
            update()
            val level = Levels.allLevels.find { it.number == currentLevel }
            if (level != null && checkHoleCollision(level.hole)) {
                isMoving = false
                handleLevelComplete(level)
            }
        }
        draw()
        window.requestAnimationFrame { gameLoop() }
    }

    private fun handleLevelComplete(level: Level) {
        val currentBest = bestScores[level.number] ?: Int.MAX_VALUE
        if (strokes < currentBest) {
            bestScores[level.number] = strokes
            saveBestScores()
        }

        val message = buildString {
            append("Level ${level.number} Complete!\n")
            append("Strokes: $strokes (Par: ${level.par})\n")
            append("Best Score: ${bestScores[level.number]}\n\n")
            
            if (currentLevel < 10) {
                append("Press OK to continue to Level ${currentLevel + 1}")
            } else {
                append("Congratulations! You've completed all levels!")
            }
        }

        window.alert(message)

        if (currentLevel < 10) {
            currentLevel++
            loadLevel(currentLevel)
        }
    }

    private fun update() {
        // Apply friction
        ball.velocityX *= 0.99
        ball.velocityY *= 0.99

        // Update position
        val newX = ball.x + ball.velocityX
        val newY = ball.y + ball.velocityY

        // Check for collisions with obstacles
        val level = Levels.allLevels.find { it.number == currentLevel }
        if (level != null) {
            var collision = false
            for (obstacle in level.obstacles) {
                when (obstacle) {
                    is Obstacle.Wall -> {
                        if (checkWallCollision(ball.x, ball.y, newX, newY, obstacle)) {
                            collision = true
                            break
                        }
                    }
                    is Obstacle.Circle -> {
                        if (checkCircleCollision(ball.x, ball.y, newX, newY, obstacle)) {
                            collision = true
                            break
                        }
                    }
                }
            }

            if (!collision) {
                ball.x = newX
                ball.y = newY
            }
        }

        // Handle wall collisions
        if (ball.x < 10 || ball.x > canvas.width - 10) {
            ball.velocityX *= -0.8
            if (ball.x < 10) ball.x = 10.0
            if (ball.x > canvas.width - 10) ball.x = canvas.width.toDouble() - 10
        }
        
        if (ball.y < 10 || ball.y > canvas.height - 10) {
            ball.velocityY *= -0.8
            if (ball.y < 10) ball.y = 10.0
            if (ball.y > canvas.height - 10) ball.y = canvas.height.toDouble() - 10
        }

        // Check if ball has stopped
        if (sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY) < 0.1) {
            isMoving = false
            ball.velocityX = 0.0
            ball.velocityY = 0.0
        }
    }

    private fun checkWallCollision(
        oldX: Double, oldY: Double,
        newX: Double, newY: Double,
        wall: Obstacle.Wall
    ): Boolean {
        val wallVector = Point(wall.end.x - wall.start.x, wall.end.y - wall.start.y)
        val wallLength = sqrt(wallVector.x * wallVector.x + wallVector.y * wallVector.y)
        val wallNormal = Point(-wallVector.y / wallLength, wallVector.x / wallLength)
        
        val ballVector = Point(newX - oldX, newY - oldY)
        val ballLength = sqrt(ballVector.x * ballVector.x + ballVector.y * ballVector.y)
        
        // Check if ball is moving towards wall
        val dotProduct = ballVector.x * wallNormal.x + ballVector.y * wallNormal.y
        if (dotProduct > 0) return false
        
        // Check if ball is within wall bounds
        val wallStartToBall = Point(oldX - wall.start.x, oldY - wall.start.y)
        val wallStartToNewBall = Point(newX - wall.start.x, newY - wall.start.y)
        
        val t = (wallStartToBall.x * wallVector.x + wallStartToBall.y * wallVector.y) / (wallLength * wallLength)
        val newT = (wallStartToNewBall.x * wallVector.x + wallStartToNewBall.y * wallVector.y) / (wallLength * wallLength)
        
        if (t < 0 || t > 1 || newT < 0 || newT > 1) return false
        
        // Check distance to wall
        val distance = abs(wallStartToBall.x * wallNormal.x + wallStartToBall.y * wallNormal.y)
        if (distance > 10) return false
        
        // Reflect velocity
        val reflection = Point(
            ballVector.x - 2 * dotProduct * wallNormal.x,
            ballVector.y - 2 * dotProduct * wallNormal.y
        )
        
        ball.velocityX = reflection.x * 0.8
        ball.velocityY = reflection.y * 0.8
        
        return true
    }

    private fun checkCircleCollision(
        oldX: Double, oldY: Double,
        newX: Double, newY: Double,
        circle: Obstacle.Circle
    ): Boolean {
        val oldDistance = sqrt(
            (oldX - circle.center.x) * (oldX - circle.center.x) +
            (oldY - circle.center.y) * (oldY - circle.center.y)
        )
        val newDistance = sqrt(
            (newX - circle.center.x) * (newX - circle.center.x) +
            (newY - circle.center.y) * (newY - circle.center.y)
        )
        
        if (oldDistance > circle.radius + 10 && newDistance > circle.radius + 10) {
            return false
        }
        
        // Calculate reflection
        val normalX = (newX - circle.center.x) / newDistance
        val normalY = (newY - circle.center.y) / newDistance
        
        val dotProduct = ball.velocityX * normalX + ball.velocityY * normalY
        ball.velocityX = (ball.velocityX - 2 * dotProduct * normalX) * 0.8
        ball.velocityY = (ball.velocityY - 2 * dotProduct * normalY) * 0.8
        
        // Move ball outside circle
        ball.x = circle.center.x + (circle.radius + 10) * normalX
        ball.y = circle.center.y + (circle.radius + 10) * normalY
        
        return true
    }

    private fun checkHoleCollision(hole: Point): Boolean {
        val dx = ball.x - hole.x
        val dy = ball.y - hole.y
        val distance = sqrt(dx * dx + dy * dy)
        return distance < 20.0
    }

    private fun draw() {
        // Clear canvas
        ctx.clearRect(0.0, 0.0, canvas.width.toDouble(), canvas.height.toDouble())

        // Draw current level
        val level = Levels.allLevels.find { it.number == currentLevel }
        if (level != null) {
            // Draw obstacles
            for (obstacle in level.obstacles) {
                when (obstacle) {
                    is Obstacle.Wall -> {
                        ctx.beginPath()
                        ctx.moveTo(obstacle.start.x, obstacle.start.y)
                        ctx.lineTo(obstacle.end.x, obstacle.end.y)
                        ctx.strokeStyle = "#666"
                        ctx.lineWidth = obstacle.thickness
                        ctx.stroke()
                        ctx.closePath()
                    }
                    is Obstacle.Circle -> {
                        ctx.beginPath()
                        ctx.arc(obstacle.center.x, obstacle.center.y, obstacle.radius, 0.0, 2 * PI)
                        ctx.fillStyle = "#666"
                        ctx.fill()
                        ctx.closePath()
                    }
                }
            }

            // Draw hole
            ctx.beginPath()
            ctx.arc(level.hole.x, level.hole.y, 20.0, 0.0, 2 * PI)
            ctx.fillStyle = "black"
            ctx.fill()
            ctx.closePath()
        }

        // Draw ball
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, 10.0, 0.0, 2 * PI)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.strokeStyle = "black"
        ctx.stroke()
        ctx.closePath()

        // Draw aim line if aiming
        if (isAiming) {
            ctx.beginPath()
            ctx.moveTo(ball.x, ball.y)
            ctx.lineTo(
                ball.x + cos(aimAngle) * (power * 5),
                ball.y + sin(aimAngle) * (power * 5)
            )
            ctx.strokeStyle = "red"
            ctx.stroke()
            ctx.closePath()
        }
    }
}

data class Ball(
    var x: Double,
    var y: Double,
    var velocityX: Double = 0.0,
    var velocityY: Double = 0.0
) {
    fun reset(newX: Double, newY: Double) {
        x = newX
        y = newY
        velocityX = 0.0
        velocityY = 0.0
    }
}

data class Hole(
    val x: Double,
    val y: Double
) 