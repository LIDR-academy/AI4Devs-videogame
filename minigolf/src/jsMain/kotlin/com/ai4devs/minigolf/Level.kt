package com.ai4devs.minigolf

import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

data class Level(
    val number: Int,
    val ballStart: Point,
    val hole: Point,
    val obstacles: List<Obstacle>,
    val par: Int
)

data class Point(val x: Double, val y: Double)

sealed class Obstacle {
    data class Wall(
        val start: Point,
        val end: Point,
        val thickness: Double = 10.0
    ) : Obstacle()

    data class Circle(
        val center: Point,
        val radius: Double
    ) : Obstacle()
}

object Levels {
    val allLevels = listOf(
        Level(
            number = 1,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = emptyList(),
            par = 3
        ),
        Level(
            number = 2,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(300.0, 200.0), Point(500.0, 200.0)),
                Obstacle.Wall(Point(300.0, 400.0), Point(500.0, 400.0))
            ),
            par = 4
        ),
        Level(
            number = 3,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Circle(Point(400.0, 300.0), 100.0)
            ),
            par = 4
        ),
        Level(
            number = 4,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(300.0, 200.0), Point(500.0, 200.0)),
                Obstacle.Circle(Point(400.0, 300.0), 50.0)
            ),
            par = 5
        ),
        Level(
            number = 5,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(300.0, 200.0), Point(500.0, 200.0)),
                Obstacle.Wall(Point(300.0, 400.0), Point(500.0, 400.0)),
                Obstacle.Circle(Point(400.0, 300.0), 30.0)
            ),
            par = 5
        ),
        Level(
            number = 6,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(200.0, 200.0), Point(600.0, 200.0)),
                Obstacle.Wall(Point(200.0, 400.0), Point(600.0, 400.0)),
                Obstacle.Circle(Point(400.0, 300.0), 40.0)
            ),
            par = 6
        ),
        Level(
            number = 7,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(300.0, 150.0), Point(500.0, 150.0)),
                Obstacle.Wall(Point(300.0, 450.0), Point(500.0, 450.0)),
                Obstacle.Circle(Point(400.0, 300.0), 60.0)
            ),
            par = 6
        ),
        Level(
            number = 8,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(200.0, 200.0), Point(400.0, 200.0)),
                Obstacle.Wall(Point(400.0, 200.0), Point(600.0, 400.0)),
                Obstacle.Circle(Point(400.0, 300.0), 30.0)
            ),
            par = 7
        ),
        Level(
            number = 9,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(300.0, 200.0), Point(500.0, 200.0)),
                Obstacle.Wall(Point(300.0, 400.0), Point(500.0, 400.0)),
                Obstacle.Circle(Point(400.0, 300.0), 40.0),
                Obstacle.Circle(Point(200.0, 300.0), 30.0),
                Obstacle.Circle(Point(600.0, 300.0), 30.0)
            ),
            par = 7
        ),
        Level(
            number = 10,
            ballStart = Point(100.0, 300.0),
            hole = Point(700.0, 300.0),
            obstacles = listOf(
                Obstacle.Wall(Point(200.0, 200.0), Point(600.0, 200.0)),
                Obstacle.Wall(Point(200.0, 400.0), Point(600.0, 400.0)),
                Obstacle.Circle(Point(400.0, 300.0), 50.0),
                Obstacle.Circle(Point(200.0, 300.0), 40.0),
                Obstacle.Circle(Point(600.0, 300.0), 40.0)
            ),
            par = 8
        )
    )
} 