#!/bin/bash

echo "Building the minigolf game..."

# Navigate to the minigolf directory
cd minigolf || { echo "Minigolf directory not found"; exit 1; }

# Find Java home automatically
if [ -x /usr/libexec/java_home ]; then
    JAVA_HOME=$(/usr/libexec/java_home)
    export JAVA_HOME
    echo "Using Java: $JAVA_HOME"
fi

# Make gradlew executable
chmod +x ./gradlew

# Stop any running Gradle processes
echo "Stopping any running Gradle processes..."
./gradlew --stop

# Clean the project
echo "Cleaning the project..."
./gradlew clean

# Build the project
echo "Building the project..."
./gradlew build

# Ensure the js/packages directory is created
mkdir -p build/js/packages/minigolf/kotlin

# Copy all JavaScript files to an easy-to-access location
echo "Copying JavaScript files to the project root..."
find build -name "minigolf.js" -exec cp {} kotlin/ \; 2>/dev/null

echo "Build completed. JavaScript files should now be available in the kotlin directory." 