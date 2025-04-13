import os

# Crear estructura de directorios
directories = [
    'ghosts-n-goblins',
    'ghosts-n-goblins/assets',
    'ghosts-n-goblins/assets/images',
    'ghosts-n-goblins/assets/audio',
    'ghosts-n-goblins/scenes'
]

for directory in directories:
    os.makedirs(directory, exist_ok=True)
    print(f"Directorio creado: {directory}")

# Crear archivos iniciales
files = [
    'ghosts-n-goblins/index.html',
    'ghosts-n-goblins/main.js',
    'ghosts-n-goblins/scenes/BootScene.js',
    'ghosts-n-goblins/scenes/TitleScene.js',
    'ghosts-n-goblins/scenes/GameScene.js',
    'ghosts-n-goblins/scenes/GameOverScene.js'
]

for file in files:
    with open(file, 'w') as f:
        f.write('')
    print(f"Archivo creado: {file}")

print("Estructura del proyecto creada con éxito.") 