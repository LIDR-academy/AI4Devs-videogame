package com.ai4devs.minigolf

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.HTMLElement
import org.w3c.dom.events.Event
import org.w3c.dom.events.MouseEvent
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

class Game(private val canvas: HTMLCanvasElement) {
    private val ctx = canvas.getContext("2d")
    private var ball = Ball(100.0, 300.0)
    private var hole = Hole(700.0, 300.0)
    private var isAiming = false
    private var aimAngle = 0.0
    private var power = 15.0
    private var strokes = 0
    private var isMoving = false

    init {
        setupEventListeners()
        gameLoop()
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
                // Adjust power based on distance
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
        scoreElement?.textContent = "Strokes: $strokes"
    }

    private fun gameLoop() {
        if (isMoving) {
            update()
            if (checkHoleCollision()) {
                isMoving = false
                ball.reset(100.0, 300.0)
                strokes = 0
                updateScore()
                window.alert("Great shot! You got it in the hole!")
            }
        }
        draw()
        window.requestAnimationFrame { gameLoop() }
    }

    private fun update() {
        // Apply friction
        ball.velocityX *= 0.99
        ball.velocityY *= 0.99

        // Update position
        ball.x += ball.velocityX
        ball.y += ball.velocityY

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

    private fun checkHoleCollision(): Boolean {
        val dx = ball.x - hole.x
        val dy = ball.y - hole.y
        val distance = sqrt(dx * dx + dy * dy)
        return distance < 20.0
    }

    private fun draw() {
        // Clear canvas
        jsObject(ctx) { 
            clearRect(0.0, 0.0, canvas.width.toDouble(), canvas.height.toDouble())

            // Draw hole
            beginPath()
            arc(hole.x, hole.y, 20.0, 0.0, 2 * PI)
            fillStyle = "black"
            fill()
            closePath()

            // Draw ball
            beginPath()
            arc(ball.x, ball.y, 10.0, 0.0, 2 * PI)
            fillStyle = "white"
            fill()
            strokeStyle = "black"
            stroke()
            closePath()

            // Draw aim line if aiming
            if (isAiming) {
                beginPath()
                moveTo(ball.x, ball.y)
                lineTo(
                    ball.x + cos(aimAngle) * (power * 5),
                    ball.y + sin(aimAngle) * (power * 5)
                )
                strokeStyle = "red"
                stroke()
                closePath()
            }
        }
    }
    
    // Helper function to work with dynamic JS objects
    private inline fun <T> jsObject(obj: Any?, block: T.() -> Unit) {
        js("block.call(obj)") as Unit
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