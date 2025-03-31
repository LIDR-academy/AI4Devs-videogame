import java.io.ByteArrayOutputStream

plugins {
    kotlin("multiplatform") version "1.9.22"
}

group = "com.ai4devs"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    js {
        browser {
            binaries.executable()
            commonWebpackConfig {
                cssSupport {
                    enabled.set(true)
                }
            }
        }
    }
    
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(kotlin("stdlib-js"))
                implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.8.0")
                implementation("org.jetbrains.kotlin-wrappers:kotlin-browser:1.0.0-pre.687")
                implementation("org.jetbrains.kotlin-wrappers:kotlin-js:1.0.0-pre.687")
                implementation(npm("core-js", "3.35.0"))
            }
        }
        
        val jsTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}

tasks.register("runGame") {
    dependsOn("jsBrowserDevelopmentRun")
    group = "application"
    description = "Runs the MiniGolf game in development mode"
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf("-Xjsr305=strict")
    }
}

// Add a task to serve the standalone HTML game
tasks.register<Copy>("copyStandaloneGame") {
    from(rootProject.projectDir.parentFile)
    include("minigolf-standalone.html")
    into(layout.buildDirectory.dir("standalone"))
    doLast {
        if (!file("${layout.buildDirectory}/standalone/minigolf-standalone.html").exists()) {
            throw GradleException("Standalone game file not found. Please ensure minigolf-standalone.html exists in the project root.")
        }
    }
}

tasks.register("serveStandaloneGame") {
    dependsOn("copyStandaloneGame")
    group = "application"
    description = "Serves the standalone MiniGolf game using a simple HTTP server"
    
    doLast {
        // Create a simple server file
        val serverFile = file("${layout.buildDirectory}/standalone/server.js")
        serverFile.writeText("""
            const http = require('http');
            const fs = require('fs');
            const path = require('path');

            const PORT = 8080;
            console.log("Starting server on port " + PORT);

            const server = http.createServer((req, res) => {
                let filePath = req.url === '/' ? './minigolf-standalone.html' : '.' + req.url;
                
                const extname = path.extname(filePath).toLowerCase();
                const contentType = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css'
                }[extname] || 'application/octet-stream';
                
                fs.readFile(filePath, (err, content) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            res.writeHead(404);
                            res.end("File not found");
                        } else {
                            res.writeHead(500);
                            res.end("Server Error: " + err.code);
                        }
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content, 'utf-8');
                    }
                });
            });

            server.listen(PORT, () => {
                console.log("MiniGolf game is running at http://localhost:" + PORT + "/");
                console.log("Press Ctrl+C to stop the server");
            });
        """.trimIndent())
        
        // Execute Node.js server in a new process
        exec {
            workingDir = file("${layout.buildDirectory}/standalone")
            commandLine = listOf("node", "server.js")
            // Keep running in the background
            isIgnoreExitValue = true
        }
    }
}

tasks.register("runStandaloneGame") {
    dependsOn("serveStandaloneGame")
    group = "application"
    description = "Runs the standalone MiniGolf game"
}

// This task will check if node is installed
tasks.register("checkNodeInstalled") {
    doLast {
        try {
            val result = exec {
                commandLine = listOf("node", "--version")
                isIgnoreExitValue = true
            }
            if (result.exitValue != 0) {
                throw GradleException("Node.js check failed with exit code ${result.exitValue}")
            }
        } catch (e: Exception) {
            throw GradleException("Node.js is required but not installed. Please install Node.js and try again.")
        }
    }
}

// Make the serve task depend on node check
tasks.named("serveStandaloneGame") {
    dependsOn("checkNodeInstalled")
} 