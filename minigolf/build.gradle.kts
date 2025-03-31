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
        freeCompilerArgs += listOf("-Xjsr305=strict")
    }
} 