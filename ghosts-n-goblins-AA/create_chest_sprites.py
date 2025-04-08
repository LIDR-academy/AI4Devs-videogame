from PIL import Image, ImageDraw
import os
import math

# Asegurar que el directorio existe
items_dir = 'ghosts-n-goblins/assets/images/Items'
os.makedirs(items_dir, exist_ok=True)

# Definir colores
COLORS = {
    'wood_dark': (101, 67, 33),
    'wood_mid': (140, 90, 40),
    'wood_light': (160, 120, 60),
    'metal_dark': (90, 90, 90),
    'metal': (130, 130, 130),
    'metal_light': (180, 180, 180),
    'gold_dark': (184, 134, 11),
    'gold': (218, 165, 32),
    'gold_light': (255, 215, 0),
    'glow': (255, 255, 200, 100),
    'transparent': (0, 0, 0, 0),
    'white': (255, 255, 255),
    'red': (200, 0, 0),
    'blue': (0, 0, 200),
    'green': (0, 150, 0),
    'armor_silver': (210, 210, 230),
    'magic_purple': (200, 0, 200),
}

# Crear una imagen transparente
def create_transparent_image(width, height):
    return Image.new('RGBA', (width, height), COLORS['transparent'])

# Función para dibujar un cofre cerrado
def draw_chest_closed(draw, x, y, width, height):
    # Cuerpo del cofre
    draw.rectangle([x, y + height/3, x + width, y + height], fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    # Detalles de madera
    draw.line([x, y + height*2/3, x + width, y + height*2/3], fill=COLORS['wood_dark'], width=1)
    
    # Tapa del cofre
    draw.rectangle([x, y, x + width, y + height/3], fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    # Detalles metálicos
    # Marco metálico
    draw.rectangle([x + 2, y + 2, x + width - 2, y + height/3 - 2], outline=COLORS['metal_dark'], width=1)
    
    # Cerradura
    draw.rectangle([x + width/2 - 3, y + height/3 - 5, x + width/2 + 3, y + height/3 + 1], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    
    # Bisagras
    draw.rectangle([x + 3, y + height/3 - 3, x + 8, y + height/3 + 3], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    draw.rectangle([x + width - 8, y + height/3 - 3, x + width - 3, y + height/3 + 3], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    
    # Refuerzos metálicos
    draw.rectangle([x + 3, y + height - 5, x + width - 3, y + height - 2], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    
    # Brillo
    draw.line([x + 3, y + 3, x + width - 3, y + 3], fill=COLORS['wood_light'], width=1)

# Función para dibujar un cofre abierto
def draw_chest_open(draw, x, y, width, height):
    # Cuerpo del cofre
    draw.rectangle([x, y + height/3, x + width, y + height], fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    # Detalles de madera
    draw.line([x, y + height*2/3, x + width, y + height*2/3], fill=COLORS['wood_dark'], width=1)
    
    # Tapa del cofre (abierta)
    # La tapa se dibuja rotada hacia atrás
    # Base de la tapa
    draw.rectangle([x, y, x + width, y + 5], fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    # Laterales de la tapa
    draw.polygon([
        (x, y + 5),
        (x - 8, y - height/5),
        (x - 8, y - height/5 + 5),
        (x, y + 10)
    ], fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    draw.polygon([
        (x + width, y + 5),
        (x + width + 8, y - height/5),
        (x + width + 8, y - height/5 + 5),
        (x + width, y + 10)
    ], fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    # Tapa abierta
    draw.rectangle([x - 8, y - height/5, x + width + 8, y - height/5 + 5], 
                   fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
    
    # Interior del cofre (con brillo)
    draw.rectangle([x + 2, y + height/3 + 2, x + width - 2, y + height - 2], 
                  fill=COLORS['wood_light'])
    
    # Bisagras
    draw.rectangle([x + 3, y + 5 - 3, x + 8, y + 5 + 3], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    draw.rectangle([x + width - 8, y + 5 - 3, x + width - 3, y + 5 + 3], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    
    # Refuerzos metálicos
    draw.rectangle([x + 3, y + height - 5, x + width - 3, y + height - 2], 
                  fill=COLORS['metal'], outline=COLORS['metal_dark'])
    
    # Brillo en el interior
    draw.line([x + 3, y + height/3 + 5, x + width - 3, y + height/3 + 5], 
             fill=COLORS['gold_light'], width=1)

# Función para dibujar un brillo para el cofre al abrirse
def draw_chest_glow(draw, x, y, width, height, intensity=1.0):
    # Centro del cofre
    cx = x + width/2
    cy = y + height/2
    
    # Círculos concéntricos con transparencia
    for i in range(3, 0, -1):
        radius = (width / 2) * i / 2
        alpha = int(100 * intensity / i)
        glow_color = (*COLORS['gold_light'][:3], alpha)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=glow_color)

# Crear sprite para el cofre cerrado
def create_chest_closed_sprite(size=32):
    img = create_transparent_image(size, size)
    draw = ImageDraw.Draw(img)
    
    # Dibujar el cofre cerrado
    margin = size / 4
    draw_chest_closed(draw, margin, margin, size - 2*margin, size - 2*margin)
    
    # Guardar la imagen
    chest_path = os.path.join(items_dir, 'chest_closed.png')
    img.save(chest_path)
    print(f"Sprite de cofre cerrado creado en {chest_path}")
    return chest_path

# Crear sprite para el cofre abierto
def create_chest_open_sprite(size=32):
    img = create_transparent_image(size, size)
    draw = ImageDraw.Draw(img)
    
    # Dibujar el cofre abierto
    margin = size / 4
    draw_chest_open(draw, margin, margin, size - 2*margin, size - 2*margin)
    
    # Guardar la imagen
    chest_path = os.path.join(items_dir, 'chest_open.png')
    img.save(chest_path)
    print(f"Sprite de cofre abierto creado en {chest_path}")
    return chest_path

# Crear sprite para el brillo del cofre
def create_chest_glow_sprite(size=64):
    img = create_transparent_image(size, size)
    draw = ImageDraw.Draw(img)
    
    # Dibujar el brillo
    draw_chest_glow(draw, 0, 0, size, size)
    
    # Guardar la imagen
    glow_path = os.path.join(items_dir, 'chest_glow.png')
    img.save(glow_path)
    print(f"Sprite de brillo de cofre creado en {glow_path}")
    return glow_path

# Crear sprite para el cofre con animación (spritesheet)
def create_chest_spritesheet(frame_size=32, num_frames=3):
    # Crear imagen para el spritesheet
    spritesheet_width = frame_size * num_frames
    spritesheet_height = frame_size
    spritesheet = create_transparent_image(spritesheet_width, spritesheet_height)
    
    # Para cada frame, dibujar una interpolación entre cerrado y abierto
    for i in range(num_frames):
        # Crear imagen para el frame actual
        frame = create_transparent_image(frame_size, frame_size)
        draw = ImageDraw.Draw(frame)
        
        # Interpolación entre cerrado y abierto
        progress = i / (num_frames - 1)
        margin = frame_size / 4
        
        if i == 0:
            # Primer frame: cofre cerrado
            draw_chest_closed(draw, margin, margin, frame_size - 2*margin, frame_size - 2*margin)
        elif i == num_frames - 1:
            # Último frame: cofre abierto
            draw_chest_open(draw, margin, margin, frame_size - 2*margin, frame_size - 2*margin)
        else:
            # Frames intermedios: interpolación
            # Para simplificar, dibujamos el cofre abierto con una rotación 
            # de la tapa proporcional al progreso
            draw_chest_open(draw, margin, margin + (1 - progress) * margin / 2, 
                           frame_size - 2*margin, frame_size - 2*margin)
            
            # Añadir brillo que aumenta con el progreso
            if progress > 0.5:
                glow_intensity = (progress - 0.5) * 2
                draw_chest_glow(draw, 0, 0, frame_size, frame_size, glow_intensity)
        
        # Pegar este frame en el spritesheet
        spritesheet.paste(frame, (i * frame_size, 0), frame)
    
    # Guardar el spritesheet
    spritesheet_path = os.path.join(items_dir, 'chest_spritesheet.png')
    spritesheet.save(spritesheet_path)
    print(f"Spritesheet de cofre creado en {spritesheet_path}")
    return spritesheet_path

# Función para crear sprites de power-ups
def create_powerup_sprite(name, size=32):
    img = create_transparent_image(size, size)
    draw = ImageDraw.Draw(img)
    
    # Coordenadas centrales
    cx = size / 2
    cy = size / 2
    inner_size = size * 0.7
    
    # Dibujar brillo de fondo para todos los power-ups
    for i in range(3, 0, -1):
        radius = (size / 2) * i / 3
        alpha = 40 - i * 10
        glow_color = (255, 255, 200, alpha)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=glow_color)
    
    # Dibujar power-up específico
    if name == "armor":
        # Dibujar una armadura (casco y peto)
        # Casco
        draw.ellipse([cx - inner_size/3, cy - inner_size/2, cx + inner_size/3, cy - inner_size/6], 
                     fill=COLORS['armor_silver'], outline=COLORS['metal_dark'])
        # Peto
        draw.rectangle([cx - inner_size/2.5, cy - inner_size/6, cx + inner_size/2.5, cy + inner_size/2], 
                       fill=COLORS['armor_silver'], outline=COLORS['metal_dark'])
        # Detalles
        draw.line([cx, cy - inner_size/6, cx, cy + inner_size/2], fill=COLORS['metal_dark'], width=1)
        
    elif name == "points":
        # Dibujar una bolsa de oro
        # Bolsa
        draw.ellipse([cx - inner_size/2, cy - inner_size/2, cx + inner_size/2, cy + inner_size/3], 
                     fill=COLORS['gold'], outline=COLORS['gold_dark'])
        # Monedas
        for i in range(3):
            offset_x = (i - 1) * inner_size/4
            draw.ellipse([cx - inner_size/8 + offset_x, cy - inner_size/8, 
                          cx + inner_size/8 + offset_x, cy + inner_size/8], 
                         fill=COLORS['gold_light'], outline=COLORS['gold_dark'])
        
    elif name == "weapon_spear":
        # Dibujar una lanza
        # Mango
        draw.rectangle([cx - inner_size/2, cy - inner_size/12, cx + inner_size/4, cy + inner_size/12], 
                       fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
        # Punta
        draw.polygon([
            (cx + inner_size/4, cy - inner_size/6),
            (cx + inner_size/2, cy),
            (cx + inner_size/4, cy + inner_size/6)
        ], fill=COLORS['metal_light'], outline=COLORS['metal_dark'])
        
    elif name == "weapon_dagger":
        # Dibujar una daga
        # Mango
        draw.rectangle([cx - inner_size/2, cy - inner_size/12, cx - inner_size/8, cy + inner_size/12], 
                       fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
        # Guardia
        draw.rectangle([cx - inner_size/8, cy - inner_size/6, cx, cy + inner_size/6], 
                       fill=COLORS['gold'], outline=COLORS['gold_dark'])
        # Hoja
        draw.polygon([
            (cx, cy - inner_size/8),
            (cx + inner_size/2, cy),
            (cx, cy + inner_size/8)
        ], fill=COLORS['metal_light'], outline=COLORS['metal_dark'])
        
    elif name == "weapon_torch":
        # Dibujar una antorcha
        # Mango
        draw.rectangle([cx - inner_size/12, cy - inner_size/2, cx + inner_size/12, cy + inner_size/6], 
                       fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
        # Cabeza
        draw.ellipse([cx - inner_size/4, cy - inner_size/2 - inner_size/6, 
                      cx + inner_size/4, cy - inner_size/3], 
                     fill=COLORS['wood_dark'])
        # Llama
        draw.ellipse([cx - inner_size/3, cy - inner_size/2 - inner_size/4, 
                      cx + inner_size/3, cy - inner_size/2], 
                     fill=COLORS['red'])
        draw.ellipse([cx - inner_size/4, cy - inner_size/2 - inner_size/3, 
                      cx + inner_size/4, cy - inner_size/2 - inner_size/12], 
                     fill=COLORS['gold'])
        
    elif name == "weapon_axe":
        # Dibujar un hacha
        # Mango
        draw.rectangle([cx - inner_size/12, cy - inner_size/2, cx + inner_size/12, cy + inner_size/3], 
                       fill=COLORS['wood_mid'], outline=COLORS['wood_dark'])
        # Cabeza
        draw.ellipse([cx - inner_size/3, cy - inner_size/2 - inner_size/8, 
                      cx + inner_size/3, cy - inner_size/2 + inner_size/4], 
                     fill=COLORS['metal'], outline=COLORS['metal_dark'])
        # Filo
        draw.polygon([
            (cx - inner_size/3, cy - inner_size/2 + inner_size/12),
            (cx - inner_size/2, cy - inner_size/2 - inner_size/12),
            (cx - inner_size/4, cy - inner_size/2 - inner_size/6)
        ], fill=COLORS['metal_light'], outline=COLORS['metal_dark'])
        
    elif name == "magic":
        # Dibujar un objeto mágico (poción)
        # Cuerpo de la poción
        draw.ellipse([cx - inner_size/3, cy - inner_size/12, 
                      cx + inner_size/3, cy + inner_size/2], 
                     fill=COLORS['blue'], outline=COLORS['metal_dark'])
        # Cuello de la poción
        draw.rectangle([cx - inner_size/6, cy - inner_size/4, 
                        cx + inner_size/6, cy - inner_size/12], 
                       fill=COLORS['magic_purple'], outline=COLORS['metal_dark'])
        # Tapón
        draw.ellipse([cx - inner_size/5, cy - inner_size/3, 
                      cx + inner_size/5, cy - inner_size/4 + inner_size/12], 
                     fill=COLORS['gold'], outline=COLORS['gold_dark'])
        # Brillo mágico
        draw.ellipse([cx - inner_size/8, cy + inner_size/6, 
                      cx + inner_size/8, cy + inner_size/3], 
                     fill=COLORS['white'])
        
    elif name == "invincible":
        # Dibujar una estrella de invencibilidad
        points = []
        num_points = 5
        inner_radius = inner_size/4
        outer_radius = inner_size/2
        for i in range(num_points * 2):
            angle = math.pi/2 + i * math.pi / num_points
            radius = outer_radius if i % 2 == 0 else inner_radius
            x = cx + radius * math.cos(angle)
            y = cy + radius * math.sin(angle)
            points.append((x, y))
        
        draw.polygon(points, fill=COLORS['gold_light'], outline=COLORS['gold_dark'])
        draw.ellipse([cx - inner_size/6, cy - inner_size/6, 
                      cx + inner_size/6, cy + inner_size/6], 
                     fill=COLORS['gold'])
        
    # Guardar la imagen
    powerup_path = os.path.join(items_dir, f'powerup_{name}.png')
    img.save(powerup_path)
    print(f"Sprite de power-up {name} creado en {powerup_path}")
    return powerup_path

# Crear todos los sprites
def create_all_sprites():
    print("Generando sprites de cofres y power-ups...")
    
    # Sprites de cofres
    create_chest_closed_sprite()
    create_chest_open_sprite()
    create_chest_glow_sprite()
    create_chest_spritesheet()
    
    # Sprites de power-ups
    create_powerup_sprite("armor")
    create_powerup_sprite("points")
    create_powerup_sprite("weapon_spear")
    create_powerup_sprite("weapon_dagger")
    create_powerup_sprite("weapon_torch")
    create_powerup_sprite("weapon_axe")
    create_powerup_sprite("magic")
    create_powerup_sprite("invincible")
    
    print("¡Todos los sprites han sido generados!")

if __name__ == "__main__":
    create_all_sprites() 