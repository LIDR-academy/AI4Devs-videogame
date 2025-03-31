package com.ai4devs.minigolf

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLCanvasElement

fun main() {
    window.onload = {
        console.log("MiniGolf game starting...")
        try {
            val canvas = document.getElementById("gameCanvas") as? HTMLCanvasElement
                ?: throw IllegalStateException("Canvas element not found")
            
            Game(canvas)
            console.log("Game initialized successfully")
        } catch (e: Exception) {
            console.error("Error initializing game: ${e.message}")
        }
    }
}

// Simple console logging extension
external object console {
    fun log(message: String)
    fun error(message: String)
} 