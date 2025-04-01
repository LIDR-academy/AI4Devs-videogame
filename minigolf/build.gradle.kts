import java.io.File

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
            webpackTask {
                output.libraryTarget = "umd"
            }
            runTask {
                mainOutputFileName = "minigolf.js"
                devServer = devServer?.copy(
                    port = 8080,
                    static = mutableListOf("$projectDir", "$rootDir")
                )
            }
            commonWebpackConfig {
                cssSupport {
                    enabled.set(true)
                }
                outputFileName = "minigolf.js"
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

// Create a task to copy index.html to the output directory
tasks.register<Copy>("copyIndexHtml") {
    from("${rootDir}/index.html") 
    into("${layout.buildDirectory.get()}/js/packages/minigolf")
}

// Make sure the copy task runs before the webpack task
tasks.named("jsBrowserDevelopmentRun") {
    dependsOn("copyIndexHtml")
}

// Ensure rootPackageJson depends on copyIndexHtml
tasks.named("rootPackageJson") {
    dependsOn("copyIndexHtml")
}

// Legacy task - kept for compatibility
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