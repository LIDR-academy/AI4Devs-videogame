#!/bin/bash

# Find Java home automatically
if [ -x /usr/libexec/java_home ]; then
    export JAVA_HOME=$(/usr/libexec/java_home)
    echo "Using Java: $JAVA_HOME"
fi

# Run the game
./gradlew runGame 