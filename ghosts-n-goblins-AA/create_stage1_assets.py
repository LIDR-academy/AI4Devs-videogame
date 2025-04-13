from PIL import Image, ImageDraw
import os
import random

# Asegurar que existe el directorio para los assets
os.makedirs("ghosts-n-goblins/assets/images/stage1", exist_ok=True)

# Colores para el escenario
COLORS = {
    "sky": (40, 40, 80),           # Cielo nocturno azul oscuro
    "ground": (80, 60, 40),        # Tierra marrón
    "grass_dark": (30, 70, 30),    # Hierba oscura
    "grass_light": (50, 90, 50),   # Hierba clara
    "stone_dark": (90, 90, 100),   # Piedra oscura
    "stone_light": (150, 150, 160), # Piedra clara
    "tree_trunk": (60, 40, 20),    # Tronco de árbol
    "tree_branches": (70, 50, 30), # Ramas de árbol
    "clouds": (60, 60, 80),        # Nubes oscuras
    "moon": (220, 220, 200),       # Luna
}

# Función para crear el fondo del nivel
def create_background(width=1600, height=600):
    img = Image.new("RGB", (width, height), COLORS["sky"])
    draw = ImageDraw.Draw(img)
    
    # Añadir luna
    moon_x, moon_y = width // 4, height // 5
    moon_radius = 40
    draw.ellipse((moon_x - moon_radius, moon_y - moon_radius, 
                  moon_x + moon_radius, moon_y + moon_radius), 
                 fill=COLORS["moon"])
    
    # Añadir nubes
    for _ in range(10):
        cloud_x = random.randint(0, width)
        cloud_y = random.randint(20, height // 3)
        cloud_width = random.randint(60, 150)
        cloud_height = random.randint(20, 40)
        
        draw.ellipse((cloud_x, cloud_y, cloud_x + cloud_width, cloud_y + cloud_height), 
                     fill=COLORS["clouds"])
    
    # Guardar imagen
    img.save("ghosts-n-goblins/assets/images/stage1/background.png")
    print("Fondo creado: background.png")
    return img

# Función para crear el suelo
def create_ground(width=128, height=32):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dibujar base de tierra
    draw.rectangle((0, 0, width, height), fill=COLORS["ground"])
    
    # Añadir textura de hierba
    for x in range(0, width, 4):
        grass_height = random.randint(3, 6)
        draw.rectangle((x, 0, x + 3, grass_height), 
                      fill=COLORS["grass_dark"])
    
    # Añadir detalles y variaciones
    for _ in range(20):
        x = random.randint(0, width - 10)
        y = random.randint(10, height - 5)
        size = random.randint(2, 5)
        color = COLORS["grass_dark"] if random.random() > 0.5 else COLORS["stone_dark"]
        draw.rectangle((x, y, x + size, y + size), fill=color)
    
    # Guardar imagen
    img.save("ghosts-n-goblins/assets/images/stage1/ground.png")
    print("Suelo creado: ground.png")
    return img

# Función para crear plataformas
def create_platform(width=96, height=24):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dibujar base de piedra
    draw.rectangle((0, 0, width, height), fill=COLORS["stone_dark"])
    
    # Añadir detalles de piedra
    for _ in range(width // 8):
        x = random.randint(0, width - 8)
        y = random.randint(0, height - 4)
        w = random.randint(4, 8)
        h = random.randint(2, 4)
        draw.rectangle((x, y, x + w, y + h), fill=COLORS["stone_light"])
    
    # Guardar imagen
    img.save("ghosts-n-goblins/assets/images/stage1/platform.png")
    print("Plataforma creada: platform.png")
    return img

# Función para crear lápidas
def create_tombstone():
    # Diferentes tamaños de lápidas
    sizes = [
        (30, 40),  # pequeña
        (40, 50),  # mediana
        (30, 60)   # alta
    ]
    
    for i, (width, height) in enumerate(sizes):
        img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Forma básica de lápida
        if i == 0:  # Lápida pequeña rectangular
            draw.rectangle((5, 10, width - 5, height), fill=COLORS["stone_dark"])
            draw.rectangle((8, 5, width - 8, 15), fill=COLORS["stone_dark"])
        elif i == 1:  # Lápida mediana con tope redondeado
            draw.rectangle((5, 15, width - 5, height), fill=COLORS["stone_dark"])
            draw.ellipse((5, 0, width - 5, 30), fill=COLORS["stone_dark"])
        else:  # Lápida alta con cruz
            draw.rectangle((8, 10, width - 8, height), fill=COLORS["stone_dark"])
            # Cruz
            cross_width = width // 3
            draw.rectangle((width//2 - cross_width//2, 0, width//2 + cross_width//2, 20), 
                          fill=COLORS["stone_dark"])
            draw.rectangle((width//2 - cross_width, 10, width//2 + cross_width, 15), 
                          fill=COLORS["stone_dark"])
        
        # Añadir detalles y grietas
        for _ in range(5):
            x = random.randint(8, width - 10)
            y = random.randint(15, height - 10)
            length = random.randint(3, 8)
            angle = random.randint(0, 3)
            
            if angle == 0:  # Horizontal
                draw.line((x, y, x + length, y), fill=COLORS["stone_light"], width=1)
            elif angle == 1:  # Vertical
                draw.line((x, y, x, y + length), fill=COLORS["stone_light"], width=1)
            else:  # Diagonal
                draw.line((x, y, x + length, y + length), fill=COLORS["stone_light"], width=1)
        
        # Guardar imagen
        img.save(f"ghosts-n-goblins/assets/images/stage1/tombstone{i+1}.png")
        print(f"Lápida creada: tombstone{i+1}.png")

# Función para crear árbol muerto
def create_dead_tree():
    width, height = 100, 150
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Tronco principal
    trunk_width = 12
    draw.rectangle((width//2 - trunk_width//2, height - 60, 
                   width//2 + trunk_width//2, height), 
                  fill=COLORS["tree_trunk"])
    
    # Ramas principales
    # Rama izquierda
    draw.line((width//2, height - 60, width//3, height//2), 
             fill=COLORS["tree_trunk"], width=8)
    # Rama derecha
    draw.line((width//2, height - 60, width*2//3, height//2), 
             fill=COLORS["tree_trunk"], width=8)
    # Rama central
    draw.line((width//2, height - 60, width//2, height//4), 
             fill=COLORS["tree_trunk"], width=8)
    
    # Ramas secundarias
    branches = [
        (width//3, height//2, width//5, height//3),
        (width*2//3, height//2, width*4//5, height//3),
        (width//2, height//4, width//3, height//8),
        (width//2, height//4, width*2//3, height//8),
    ]
    
    for start_x, start_y, end_x, end_y in branches:
        draw.line((start_x, start_y, end_x, end_y), 
                 fill=COLORS["tree_branches"], width=4)
    
    # Guardar imagen
    img.save("ghosts-n-goblins/assets/images/stage1/dead_tree.png")
    print("Árbol muerto creado: dead_tree.png")
    return img

# Crear una textura de tierra con pasto para los sprites de plataforma extendida
def create_extended_ground(width=256, height=64):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Parte superior con hierba
    draw.rectangle((0, 0, width, 16), fill=COLORS["ground"])
    
    # Añadir textura de hierba en la parte superior
    for x in range(0, width, 4):
        grass_height = random.randint(3, 6)
        draw.rectangle((x, 0, x + 3, grass_height), 
                      fill=COLORS["grass_dark"])
    
    # Parte inferior de tierra
    draw.rectangle((0, 16, width, height), fill=COLORS["ground"])
    
    # Añadir detalles y variaciones
    for _ in range(40):
        x = random.randint(0, width - 10)
        y = random.randint(20, height - 5)
        size = random.randint(2, 5)
        color = (70, 50, 30) if random.random() > 0.5 else (90, 70, 50)
        draw.rectangle((x, y, x + size, y + size), fill=color)
    
    # Guardar imagen
    img.save("ghosts-n-goblins/assets/images/stage1/extended_ground.png")
    print("Plataforma de tierra creada: extended_ground.png")
    return img

# Crear todas las assets
create_background()
create_ground()
create_platform()
create_tombstone()
create_dead_tree()
create_extended_ground()

print("Todos los assets para el escenario 1 (cementerio) han sido creados!") 