from PIL import Image, ImageDraw
import os

# Asegurar que el directorio existe
enemy_dir = 'ghosts-n-goblins/assets/images/enemies'
os.makedirs(enemy_dir, exist_ok=True)

# Definir dimensiones
FRAME_WIDTH = 64
FRAME_HEIGHT = 64
NUM_FRAMES = 6
SPRITE_WIDTH = FRAME_WIDTH * NUM_FRAMES

# Colores
ZOMBIE_SKIN = (130, 157, 120)  # Verde grisáceo
ZOMBIE_CLOTHES = (70, 90, 65)  # Verde oscuro para ropa
ZOMBIE_DETAILS = (50, 60, 45)  # Detalles más oscuros
DIRT_COLOR = (101, 67, 33)     # Marrón para tierra
DIRT_LIGHT = (140, 100, 60)    # Tierra más clara

# Crear la imagen
zombie_img = Image.new('RGBA', (SPRITE_WIDTH, FRAME_HEIGHT), color=(0, 0, 0, 0))
draw = ImageDraw.Draw(zombie_img)

# Función para dibujar un frame del zombie
def draw_zombie_frame(draw, x, y, frame_num):
    if frame_num == 0:
        # Frame 1: Solo manos saliendo de la tierra
        # Tierra
        draw.ellipse([x+22, y+50, x+42, y+60], fill=DIRT_COLOR)
        # Manos
        draw.ellipse([x+20, y+45, x+28, y+52], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+36, y+45, x+44, y+52], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Dedos
        draw.rectangle([x+19, y+42, x+21, y+48], fill=ZOMBIE_SKIN)
        draw.rectangle([x+24, y+42, x+26, y+48], fill=ZOMBIE_SKIN)
        draw.rectangle([x+38, y+42, x+40, y+48], fill=ZOMBIE_SKIN)
        draw.rectangle([x+43, y+42, x+45, y+48], fill=ZOMBIE_SKIN)
        # Partículas de tierra
        for i in range(5):
            offset_x = i * 5
            draw.ellipse([x+24+offset_x, y+52, x+28+offset_x, y+56], fill=DIRT_LIGHT)
    
    elif frame_num == 1:
        # Frame 2: Cabeza y parte superior del torso
        # Tierra
        draw.ellipse([x+18, y+48, x+46, y+60], fill=DIRT_COLOR)
        # Cabeza
        draw.ellipse([x+24, y+24, x+40, y+40], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Ojos
        draw.ellipse([x+28, y+30, x+31, y+33], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+33, y+30, x+36, y+33], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+29, y+31, x+30, y+32], fill=(0, 0, 0))
        draw.ellipse([x+34, y+31, x+35, y+32], fill=(0, 0, 0))
        # Boca
        draw.arc([x+29, y+33, x+35, y+39], 20, 160, fill=ZOMBIE_DETAILS, width=1)
        # Torso superior
        draw.rectangle([x+26, y+40, x+38, y+50], fill=ZOMBIE_CLOTHES, outline=ZOMBIE_DETAILS)
        # Brazos
        draw.rectangle([x+20, y+40, x+26, y+48], fill=ZOMBIE_CLOTHES)
        draw.rectangle([x+38, y+40, x+44, y+48], fill=ZOMBIE_CLOTHES)
        # Manos
        draw.ellipse([x+16, y+45, x+24, y+52], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+40, y+45, x+48, y+52], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Partículas de tierra
        for i in range(3):
            offset_x = i * 7
            draw.ellipse([x+20+offset_x, y+50, x+24+offset_x, y+54], fill=DIRT_LIGHT)
    
    elif frame_num == 2:
        # Frame 3: Zombie hasta la cintura
        # Tierra
        draw.ellipse([x+16, y+54, x+48, y+64], fill=DIRT_COLOR)
        # Cabeza
        draw.ellipse([x+24, y+20, x+40, y+36], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Ojos
        draw.ellipse([x+28, y+26, x+31, y+29], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+33, y+26, x+36, y+29], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+29, y+27, x+30, y+28], fill=(0, 0, 0))
        draw.ellipse([x+34, y+27, x+35, y+28], fill=(0, 0, 0))
        # Boca
        draw.arc([x+29, y+28, x+35, y+34], 20, 160, fill=ZOMBIE_DETAILS, width=1)
        # Torso completo
        draw.rectangle([x+26, y+36, x+38, y+54], fill=ZOMBIE_CLOTHES, outline=ZOMBIE_DETAILS)
        # Desgarro en la ropa
        draw.line([(x+30, y+40), (x+34, y+44)], fill=ZOMBIE_DETAILS, width=1)
        draw.line([(x+32, y+48), (x+36, y+52)], fill=ZOMBIE_DETAILS, width=1)
        # Brazos
        draw.rectangle([x+18, y+36, x+26, y+44], fill=ZOMBIE_CLOTHES)
        draw.rectangle([x+38, y+36, x+46, y+44], fill=ZOMBIE_CLOTHES)
        # Desgarro en los brazos
        draw.line([(x+22, y+40), (x+24, y+42)], fill=ZOMBIE_DETAILS, width=1)
        draw.line([(x+40, y+40), (x+42, y+42)], fill=ZOMBIE_DETAILS, width=1)
        # Manos
        draw.ellipse([x+14, y+41, x+22, y+48], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+42, y+41, x+50, y+48], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Partículas de tierra
        for i in range(4):
            offset_x = i * 8
            draw.ellipse([x+16+offset_x, y+56, x+20+offset_x, y+60], fill=DIRT_LIGHT)
    
    elif frame_num == 3:
        # Frame 4: Zombie completamente fuera
        # Cabeza
        draw.ellipse([x+24, y+12, x+40, y+28], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Ojos
        draw.ellipse([x+28, y+18, x+31, y+21], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+33, y+18, x+36, y+21], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+29, y+19, x+30, y+20], fill=(0, 0, 0))
        draw.ellipse([x+34, y+19, x+35, y+20], fill=(0, 0, 0))
        # Boca
        draw.arc([x+29, y+20, x+35, y+26], 20, 160, fill=ZOMBIE_DETAILS, width=1)
        # Torso
        draw.rectangle([x+26, y+28, x+38, y+44], fill=ZOMBIE_CLOTHES, outline=ZOMBIE_DETAILS)
        # Desgarros en la ropa
        draw.line([(x+30, y+32), (x+34, y+36)], fill=ZOMBIE_DETAILS, width=1)
        draw.line([(x+32, y+38), (x+36, y+42)], fill=ZOMBIE_DETAILS, width=1)
        # Brazos extendidos
        draw.rectangle([x+16, y+28, x+26, y+36], fill=ZOMBIE_CLOTHES)
        draw.rectangle([x+38, y+28, x+48, y+36], fill=ZOMBIE_CLOTHES)
        # Desgarros en los brazos
        draw.line([(x+20, y+32), (x+22, y+34)], fill=ZOMBIE_DETAILS, width=1)
        draw.line([(x+42, y+32), (x+44, y+34)], fill=ZOMBIE_DETAILS, width=1)
        # Manos
        draw.ellipse([x+12, y+33, x+20, y+40], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+44, y+33, x+52, y+40], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Piernas
        draw.rectangle([x+26, y+44, x+32, y+58], fill=ZOMBIE_CLOTHES)
        draw.rectangle([x+32, y+44, x+38, y+58], fill=ZOMBIE_CLOTHES)
        # Pies
        draw.ellipse([x+24, y+56, x+32, y+62], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+32, y+56, x+40, y+62], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Restos de tierra
        draw.ellipse([x+28, y+60, x+36, y+64], fill=DIRT_COLOR)
    
    elif frame_num == 4:
        # Frame 5: Caminando (primer paso)
        # Cabeza
        draw.ellipse([x+24, y+12, x+40, y+28], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Ojos
        draw.ellipse([x+28, y+18, x+31, y+21], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+33, y+18, x+36, y+21], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+29, y+19, x+30, y+20], fill=(0, 0, 0))
        draw.ellipse([x+34, y+19, x+35, y+20], fill=(0, 0, 0))
        # Boca
        draw.arc([x+29, y+20, x+35, y+26], 20, 160, fill=ZOMBIE_DETAILS, width=1)
        # Torso
        draw.rectangle([x+26, y+28, x+38, y+44], fill=ZOMBIE_CLOTHES, outline=ZOMBIE_DETAILS)
        # Desgarros
        draw.line([(x+30, y+32), (x+34, y+36)], fill=ZOMBIE_DETAILS, width=1)
        draw.line([(x+32, y+38), (x+36, y+42)], fill=ZOMBIE_DETAILS, width=1)
        # Brazos extendidos caminando
        draw.rectangle([x+20, y+28, x+26, y+38], fill=ZOMBIE_CLOTHES)  # Brazo trasero
        draw.rectangle([x+38, y+28, x+46, y+34], fill=ZOMBIE_CLOTHES)  # Brazo delantero
        # Manos
        draw.ellipse([x+16, y+36, x+24, y+42], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+44, y+30, x+52, y+37], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Piernas caminando
        draw.rectangle([x+28, y+44, x+34, y+58], fill=ZOMBIE_CLOTHES)  # Pierna trasera
        draw.rectangle([x+34, y+44, x+40, y+52], fill=ZOMBIE_CLOTHES)  # Pierna delantera
        draw.rectangle([x+32, y+52, x+38, y+58], fill=ZOMBIE_CLOTHES)  # Continuación pierna delantera
        # Pies
        draw.ellipse([x+26, y+56, x+34, y+62], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+36, y+56, x+44, y+62], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
    
    else:  # frame_num == 5
        # Frame 6: Caminando (segundo paso)
        # Cabeza
        draw.ellipse([x+24, y+12, x+40, y+28], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Ojos
        draw.ellipse([x+28, y+18, x+31, y+21], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+33, y+18, x+36, y+21], fill=(255, 255, 255), outline=ZOMBIE_DETAILS)
        draw.ellipse([x+29, y+19, x+30, y+20], fill=(0, 0, 0))
        draw.ellipse([x+34, y+19, x+35, y+20], fill=(0, 0, 0))
        # Boca
        draw.arc([x+29, y+20, x+35, y+26], 20, 160, fill=ZOMBIE_DETAILS, width=1)
        # Torso
        draw.rectangle([x+26, y+28, x+38, y+44], fill=ZOMBIE_CLOTHES, outline=ZOMBIE_DETAILS)
        # Desgarros
        draw.line([(x+30, y+32), (x+34, y+36)], fill=ZOMBIE_DETAILS, width=1)
        draw.line([(x+32, y+38), (x+36, y+42)], fill=ZOMBIE_DETAILS, width=1)
        # Brazos extendidos caminando (posición opuesta)
        draw.rectangle([x+18, y+28, x+26, y+34], fill=ZOMBIE_CLOTHES)  # Brazo delantero
        draw.rectangle([x+38, y+28, x+44, y+38], fill=ZOMBIE_CLOTHES)  # Brazo trasero
        # Manos
        draw.ellipse([x+14, y+30, x+22, y+37], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+40, y+36, x+48, y+42], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        # Piernas caminando (posición opuesta)
        draw.rectangle([x+28, y+44, x+34, y+52], fill=ZOMBIE_CLOTHES)  # Pierna delantera
        draw.rectangle([x+26, y+52, x+32, y+58], fill=ZOMBIE_CLOTHES)  # Continuación pierna delantera
        draw.rectangle([x+34, y+44, x+40, y+58], fill=ZOMBIE_CLOTHES)  # Pierna trasera
        # Pies
        draw.ellipse([x+24, y+56, x+32, y+62], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)
        draw.ellipse([x+34, y+56, x+42, y+62], fill=ZOMBIE_SKIN, outline=ZOMBIE_DETAILS)

# Dibujar cada frame
for frame in range(NUM_FRAMES):
    draw_zombie_frame(draw, frame * FRAME_WIDTH, 0, frame)

# Guardar la imagen
zombie_img.save(os.path.join(enemy_dir, 'Zombie.png'))
print(f"Sprite de Zombie creado en {os.path.join(enemy_dir, 'Zombie.png')}") 