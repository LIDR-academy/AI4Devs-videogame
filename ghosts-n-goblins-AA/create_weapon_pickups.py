from PIL import Image, ImageDraw
import os
import math

# Asegurar que el directorio existe
weapons_dir = 'ghosts-n-goblins/assets/images/Weapons'
os.makedirs(weapons_dir, exist_ok=True)

# Definir tamaños comunes
PICKUP_SIZE = 32
COLORS = {
    'white': (255, 255, 255),
    'light_yellow': (255, 255, 200),
    'yellow': (255, 255, 0),
    'orange': (255, 165, 0),
    'red': (255, 0, 0),
    'brown': (139, 69, 19),
    'dark_brown': (101, 67, 33),
    'light_gray': (200, 200, 200),
    'gray': (128, 128, 128),
    'dark_gray': (64, 64, 64),
    'metal': (180, 180, 200),
    'wood': (150, 100, 50),
    'black': (0, 0, 0),
    'transparent': (0, 0, 0, 0),
    'gold': (255, 215, 0),
    'glow': (255, 255, 200, 100),
}

def create_transparent_image(width, height):
    """Crea una imagen transparente con las dimensiones dadas"""
    return Image.new('RGBA', (width, height), COLORS['transparent'])

# Crear efecto de brillo para todos los pickups
def add_glow(draw, x, y, size):
    # Dibujar brillo en varias capas con transparencia
    for i in range(3):
        radius = size - i * 2
        alpha = 40 - i * 10
        glow_color = (255, 255, 200, alpha)
        draw.ellipse(
            [x - radius, y - radius, x + radius, y + radius],
            fill=glow_color
        )

# 1. PICKUP DE LANZA (SPEAR)
def create_spear_pickup():
    spear_img = create_transparent_image(PICKUP_SIZE, PICKUP_SIZE)
    draw = ImageDraw.Draw(spear_img)
    
    # Coordenadas centrales
    center_x = PICKUP_SIZE // 2
    center_y = PICKUP_SIZE // 2
    
    # Dibujar efecto de brillo
    add_glow(draw, center_x, center_y, PICKUP_SIZE // 2)
    
    # Dibujar plataforma/pedestal
    draw.rectangle([center_x - 10, center_y + 6, center_x + 10, center_y + 10], 
                  fill=COLORS['dark_gray'], outline=COLORS['light_gray'])
    
    # Dibujar la lanza (versión pequeña)
    spear_length = 18
    
    # Cuerpo de la lanza
    draw.line([center_x - spear_length/2, center_y, center_x + spear_length/2 - 4, center_y], 
              fill=COLORS['metal'], width=3)
    
    # Punta de la lanza
    draw.polygon([
        (center_x + spear_length/2 - 4, center_y - 2),
        (center_x + spear_length/2, center_y),
        (center_x + spear_length/2 - 4, center_y + 2)
    ], fill=COLORS['light_gray'])
    
    # Decoración dorada
    draw.ellipse([center_x - 4, center_y - 4, center_x, center_y + 4], 
                fill=COLORS['gold'], outline=COLORS['dark_gray'])
    
    # Guardar la imagen
    spear_path = os.path.join(weapons_dir, 'spear-pickup.png')
    spear_img.save(spear_path)
    print(f"Sprite de pickup de lanza creado en {spear_path}")
    return spear_path

# 2. PICKUP DE DAGA (DAGGER)
def create_dagger_pickup():
    dagger_img = create_transparent_image(PICKUP_SIZE, PICKUP_SIZE)
    draw = ImageDraw.Draw(dagger_img)
    
    # Coordenadas centrales
    center_x = PICKUP_SIZE // 2
    center_y = PICKUP_SIZE // 2
    
    # Dibujar efecto de brillo
    add_glow(draw, center_x, center_y, PICKUP_SIZE // 2)
    
    # Dibujar plataforma/pedestal
    draw.rectangle([center_x - 10, center_y + 6, center_x + 10, center_y + 10], 
                  fill=COLORS['dark_gray'], outline=COLORS['light_gray'])
    
    # Dibujar la daga (versión pequeña)
    dagger_length = 14
    
    # Mango
    draw.rectangle([center_x - dagger_length/2, center_y - 1, center_x - dagger_length/2 + 5, center_y + 1], 
                  fill=COLORS['dark_brown'])
    
    # Guardia
    draw.rectangle([center_x - dagger_length/2 + 5, center_y - 3, center_x - dagger_length/2 + 7, center_y + 3], 
                  fill=COLORS['gold'])
    
    # Hoja
    draw.polygon([
        (center_x - dagger_length/2 + 7, center_y - 2),
        (center_x + dagger_length/2, center_y),
        (center_x - dagger_length/2 + 7, center_y + 2)
    ], fill=COLORS['metal'], outline=COLORS['light_gray'])
    
    # Guardar la imagen
    dagger_path = os.path.join(weapons_dir, 'dagger-pickup.png')
    dagger_img.save(dagger_path)
    print(f"Sprite de pickup de daga creado en {dagger_path}")
    return dagger_path

# 3. PICKUP DE ANTORCHA (TORCH)
def create_torch_pickup():
    torch_img = create_transparent_image(PICKUP_SIZE, PICKUP_SIZE)
    draw = ImageDraw.Draw(torch_img)
    
    # Coordenadas centrales
    center_x = PICKUP_SIZE // 2
    center_y = PICKUP_SIZE // 2
    
    # Dibujar efecto de brillo
    add_glow(draw, center_x, center_y, PICKUP_SIZE // 2)
    
    # Dibujar plataforma/pedestal
    draw.rectangle([center_x - 10, center_y + 6, center_x + 10, center_y + 10], 
                  fill=COLORS['dark_gray'], outline=COLORS['light_gray'])
    
    # Dibujar la antorcha (versión pequeña)
    torch_height = 16
    
    # Mango
    draw.rectangle([center_x - 1, center_y - torch_height/2 + 4, center_x + 1, center_y + 4], 
                  fill=COLORS['wood'])
    
    # Cabeza de la antorcha
    draw.rectangle([center_x - 3, center_y - torch_height/2, center_x + 3, center_y - torch_height/2 + 4], 
                  fill=COLORS['dark_brown'])
    
    # Llama
    draw.ellipse([center_x - 4, center_y - torch_height/2 - 6, center_x + 4, center_y - torch_height/2], 
                fill=COLORS['orange'])
    draw.ellipse([center_x - 3, center_y - torch_height/2 - 5, center_x + 3, center_y - torch_height/2 - 1], 
                fill=COLORS['yellow'])
    draw.ellipse([center_x - 1, center_y - torch_height/2 - 4, center_x + 1, center_y - torch_height/2 - 2], 
                fill=COLORS['white'])
    
    # Guardar la imagen
    torch_path = os.path.join(weapons_dir, 'torch-pickup.png')
    torch_img.save(torch_path)
    print(f"Sprite de pickup de antorcha creado en {torch_path}")
    return torch_path

# 4. PICKUP DE HACHA (AXE)
def create_axe_pickup():
    axe_img = create_transparent_image(PICKUP_SIZE, PICKUP_SIZE)
    draw = ImageDraw.Draw(axe_img)
    
    # Coordenadas centrales
    center_x = PICKUP_SIZE // 2
    center_y = PICKUP_SIZE // 2
    
    # Dibujar efecto de brillo
    add_glow(draw, center_x, center_y, PICKUP_SIZE // 2)
    
    # Dibujar plataforma/pedestal
    draw.rectangle([center_x - 10, center_y + 6, center_x + 10, center_y + 10], 
                  fill=COLORS['dark_gray'], outline=COLORS['light_gray'])
    
    # Dibujar el hacha (versión pequeña)
    axe_size = 14
    
    # Mango
    draw.line([center_x, center_y, center_x, center_y - axe_size + 2], 
             fill=COLORS['wood'], width=2)
    
    # Cabeza del hacha
    draw.polygon([
        (center_x, center_y - axe_size + 2),
        (center_x - 6, center_y - axe_size + 6),
        (center_x - 4, center_y - axe_size + 9),
        (center_x + 4, center_y - axe_size + 9),
        (center_x + 6, center_y - axe_size + 6)
    ], fill=COLORS['metal'], outline=COLORS['light_gray'])
    
    # Borde afilado
    draw.line([center_x - 6, center_y - axe_size + 6, center_x + 6, center_y - axe_size + 6], 
             fill=COLORS['light_gray'], width=1)
    
    # Guardar la imagen
    axe_path = os.path.join(weapons_dir, 'axe-pickup.png')
    axe_img.save(axe_path)
    print(f"Sprite de pickup de hacha creado en {axe_path}")
    return axe_path

# 5. CREAR PARTÍCULA DE BRILLO (SPARKLE)
def create_sparkle():
    sparkle_img = create_transparent_image(16, 16)
    draw = ImageDraw.Draw(sparkle_img)
    
    # Coordenadas centrales
    center_x = 8
    center_y = 8
    
    # Crear estrella brillante
    for i in range(4):
        angle = math.radians(45 * i)
        length = 7
        end_x = center_x + length * math.cos(angle)
        end_y = center_y + length * math.sin(angle)
        
        draw.line([center_x, center_y, end_x, end_y], 
                 fill=COLORS['light_yellow'], width=2)
    
    # Círculo central
    draw.ellipse([center_x - 2, center_y - 2, center_x + 2, center_y + 2], 
                fill=COLORS['white'])
    
    # Guardar la imagen
    sparkle_path = os.path.join(weapons_dir, 'sparkle.png')
    sparkle_img.save(sparkle_path)
    print(f"Sprite de partícula de brillo creado en {sparkle_path}")
    return sparkle_path

# Crear todos los pickups
def create_all_pickups():
    print("Generando sprites de pickups de armas...")
    create_spear_pickup()
    create_dagger_pickup()
    create_torch_pickup()
    create_axe_pickup()
    create_sparkle()
    print("¡Todos los sprites de pickups han sido generados!")

if __name__ == "__main__":
    create_all_pickups() 