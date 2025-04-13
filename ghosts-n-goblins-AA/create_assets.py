from PIL import Image, ImageDraw
import os

# Asegurarse de que el directorio existe
os.makedirs('ghosts-n-goblins/assets/images', exist_ok=True)
os.makedirs('ghosts-n-goblins/assets/audio', exist_ok=True)

# Crear imágenes básicas
# Fondo del título
img = Image.new('RGB', (800, 600), color=(0, 0, 51))
img.save('ghosts-n-goblins/assets/images/title-bg.png')

# Plataforma base
img = Image.new('RGB', (400, 32), color=(139, 69, 19))
draw = ImageDraw.Draw(img)
draw.rectangle([0, 0, 399, 31], outline=(101, 67, 33))
img.save('ghosts-n-goblins/assets/images/ground.png')

# Plataforma
img = Image.new('RGB', (100, 16), color=(139, 69, 19))
draw = ImageDraw.Draw(img)
draw.rectangle([0, 0, 99, 15], outline=(101, 67, 33))
img.save('ghosts-n-goblins/assets/images/platform.png')

# Spritesheet del personaje
# Crear un arthur.png simple con 9 frames (3x3)
img = Image.new('RGBA', (288, 48), color=(0, 0, 0, 0))
draw = ImageDraw.Draw(img)
colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), 
          (255, 255, 0), (255, 0, 255), (0, 255, 255),
          (128, 128, 255), (255, 128, 128), (128, 255, 128)]

for i in range(9):
    x = i * 32
    color = colors[i]
    draw.rectangle([x, 0, x+31, 47], fill=color)
    draw.rectangle([x+8, 8, x+23, 23], fill=(255, 255, 255))
    draw.ellipse([x+10, 10, x+21, 21], fill=(0, 0, 0))

img.save('ghosts-n-goblins/assets/images/arthur.png')

# Crear archivos de audio vacíos
open('ghosts-n-goblins/assets/audio/title-music.mp3', 'w').close()
open('ghosts-n-goblins/assets/audio/game-music.mp3', 'w').close()
open('ghosts-n-goblins/assets/audio/gameover-music.mp3', 'w').close()

print('Assets creados con éxito') 