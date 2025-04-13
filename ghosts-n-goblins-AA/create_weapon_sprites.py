from PIL import Image, ImageDraw
import os
import math

# Asegurar que el directorio existe
weapons_dir = 'ghosts-n-goblins/assets/images/Weapons'
os.makedirs(weapons_dir, exist_ok=True)

# Definir tamaños comunes
FRAME_SIZE = 32
COLORS = {
    # Colores base
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
    # Transparente
    'transparent': (0, 0, 0, 0),
}

def create_transparent_image(width, height):
    """Crea una imagen transparente con las dimensiones dadas"""
    return Image.new('RGBA', (width, height), COLORS['transparent'])

# 1. LANZA (SPEAR)
def create_spear_sprite():
    """Crea el sprite para la lanza con 6 frames: 3 para vuelo, 3 para impacto"""
    # Dimensiones: 192x32 (6 frames de 32x32)
    spear_img = create_transparent_image(FRAME_SIZE * 6, FRAME_SIZE)
    draw = ImageDraw.Draw(spear_img)
    
    # Vuelo de la lanza (3 frames con rotación)
    angles = [0, 15, 30]  # Ángulos para la rotación
    
    for i, angle in enumerate(angles):
        # Coordenadas del frame actual
        x = i * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Longitud de la lanza
        spear_length = 24
        
        # Calcular el punto de inicio y fin de la lanza según el ángulo
        rad_angle = math.radians(angle)
        start_x = center_x - (spear_length/2) * math.cos(rad_angle)
        start_y = center_y - (spear_length/2) * math.sin(rad_angle)
        end_x = center_x + (spear_length/2) * math.cos(rad_angle)
        end_y = center_y + (spear_length/2) * math.sin(rad_angle)
        
        # Dibujar el cuerpo principal de la lanza
        draw.line([start_x, start_y, end_x, end_y], fill=COLORS['metal'], width=3)
        
        # Dibujar la punta de la lanza
        tip_size = 5
        tip_x = end_x + tip_size * math.cos(rad_angle)
        tip_y = end_y + tip_size * math.sin(rad_angle)
        
        # Línea principal de la punta
        draw.line([end_x, end_y, tip_x, tip_y], fill=COLORS['light_gray'], width=5)
        
        # Doblar ligeramente para hacer una punta triangular
        perp_angle1 = rad_angle + math.pi/2
        perp_angle2 = rad_angle - math.pi/2
        
        # Puntos para formar un triángulo en la punta
        side1_x = end_x + 3 * math.cos(perp_angle1)
        side1_y = end_y + 3 * math.sin(perp_angle1)
        side2_x = end_x + 3 * math.cos(perp_angle2)
        side2_y = end_y + 3 * math.sin(perp_angle2)
        
        # Dibujar la punta triangular
        draw.polygon([
            (end_x, end_y),
            (tip_x, tip_y),
            (side1_x, side1_y),
            (tip_x, tip_y),
            (side2_x, side2_y)
        ], fill=COLORS['light_gray'])
    
    # Impacto de la lanza (3 frames)
    for i in range(3):
        # Coordenadas del frame actual
        x = (i + 3) * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Radio del destello de impacto (aumenta con cada frame)
        radius = 4 + i * 3
        
        # Dibujar el destello central
        draw.ellipse(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            fill=COLORS['light_yellow']
        )
        
        # Líneas de impacto (fragmentos)
        num_lines = 6 + i * 2
        for j in range(num_lines):
            angle = math.radians((360 / num_lines) * j)
            line_length = radius + 2 + i * 2
            end_x = center_x + line_length * math.cos(angle)
            end_y = center_y + line_length * math.sin(angle)
            
            # Color degradado para las líneas
            if j % 3 == 0:
                line_color = COLORS['yellow']
            elif j % 3 == 1:
                line_color = COLORS['light_gray']
            else:
                line_color = COLORS['white']
                
            draw.line([center_x, center_y, end_x, end_y], fill=line_color, width=1)
    
    # Guardar la imagen
    spear_path = os.path.join(weapons_dir, 'Spear.png')
    spear_img.save(spear_path)
    print(f"Sprite de lanza creado en {spear_path}")
    return spear_path

# 2. DAGA (DAGGER)
def create_dagger_sprite():
    """Crea el sprite para la daga con 5 frames: 2 para vuelo, 3 para impacto"""
    # Dimensiones: 160x32 (5 frames de 32x32)
    dagger_img = create_transparent_image(FRAME_SIZE * 5, FRAME_SIZE)
    draw = ImageDraw.Draw(dagger_img)
    
    # Vuelo de la daga (2 frames con ligero brillo)
    for i in range(2):
        # Coordenadas del frame actual
        x = i * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Dibujar el cuerpo de la daga
        dagger_length = 14
        handle_length = 6
        
        # La daga apunta hacia la derecha
        blade_start_x = center_x - dagger_length / 2
        blade_start_y = center_y
        blade_end_x = center_x + dagger_length / 2 - handle_length
        blade_end_y = center_y
        
        # Dibujar la hoja de la daga
        draw.line([blade_start_x, blade_start_y, blade_end_x, blade_end_y], fill=COLORS['light_gray'], width=3)
        
        # Dibujar la punta de la daga (triángulo)
        tip_size = 4
        draw.polygon([
            (blade_end_x, blade_end_y),
            (blade_end_x + tip_size, blade_end_y - tip_size/2),
            (blade_end_x + tip_size, blade_end_y + tip_size/2)
        ], fill=COLORS['light_gray'])
        
        # Dibujar el mango de la daga
        handle_start_x = blade_start_x - handle_length
        handle_start_y = center_y
        draw.line([handle_start_x, handle_start_y, blade_start_x, blade_start_y], fill=COLORS['wood'], width=2)
        
        # Dibujar la empuñadura
        draw.rectangle([handle_start_x - 2, handle_start_y - 3, handle_start_x, handle_start_y + 3], fill=COLORS['dark_brown'])
        
        # Si es el segundo frame, añadir brillo
        if i == 1:
            # Pequeño brillo alrededor de la hoja
            for j in range(3):
                draw.ellipse(
                    [blade_end_x - j*2 - 2, blade_end_y - j - 1, 
                     blade_end_x - j*2 + 2, blade_end_y + j + 1],
                    outline=COLORS['light_yellow'],
                    width=1
                )
    
    # Impacto de la daga (3 frames)
    for i in range(3):
        # Coordenadas del frame actual
        x = (i + 2) * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Destellos de impacto
        size = 3 + i * 2
        for j in range(4):
            angle = math.radians(45 + j * 90)  # 45, 135, 225, 315 grados
            offset_x = (size + 2) * math.cos(angle)
            offset_y = (size + 2) * math.sin(angle)
            pos_x = center_x + offset_x
            pos_y = center_y + offset_y
            
            draw.ellipse(
                [pos_x - size, pos_y - size, pos_x + size, pos_y + size],
                fill=COLORS['yellow'] if j % 2 == 0 else COLORS['white']
            )
        
        # Dibujar fragmentos de la daga
        draw.line(
            [center_x - 5 - i, center_y - 5 - i*2, center_x + 5 + i, center_y + 5 + i*2],
            fill=COLORS['metal'],
            width=2
        )
        draw.line(
            [center_x + 5 + i, center_y - 5 - i*2, center_x - 5 - i, center_y + 5 + i*2],
            fill=COLORS['metal'],
            width=2
        )
    
    # Guardar la imagen
    dagger_path = os.path.join(weapons_dir, 'Dagger.png')
    dagger_img.save(dagger_path)
    print(f"Sprite de daga creado en {dagger_path}")
    return dagger_path

# 3. ANTORCHA (TORCH)
def create_torch_sprite():
    """Crea el sprite para la antorcha con 7 frames: 3 para vuelo, 4 para impacto"""
    # Dimensiones: 224x32 (7 frames de 32x32)
    torch_img = create_transparent_image(FRAME_SIZE * 7, FRAME_SIZE)
    draw = ImageDraw.Draw(torch_img)
    
    # Vuelo de la antorcha (3 frames con llama animada)
    for i in range(3):
        # Coordenadas del frame actual
        x = i * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Dibujar el mango de la antorcha
        handle_length = 12
        handle_width = 3
        handle_x = center_x - handle_length/2
        handle_y = center_y
        draw.line([handle_x, handle_y, handle_x + handle_length, handle_y], 
                 fill=COLORS['wood'], width=handle_width)
        
        # Dibujar la parte superior de la antorcha (cabeza)
        head_size = 4
        head_x = handle_x + handle_length
        draw.rectangle([head_x, handle_y - head_size, head_x + head_size, handle_y + head_size], 
                      fill=COLORS['dark_brown'])
        
        # Dibujar la llama (diferente en cada frame)
        flame_height = 8 + i * 2  # La llama crece ligeramente
        flame_width = 6 + i
        flame_x = head_x + head_size / 2
        flame_y = handle_y - flame_height / 2
        
        # Llama base (naranja)
        draw.ellipse([flame_x, flame_y, flame_x + flame_width, flame_y + flame_height], 
                    fill=COLORS['orange'])
        
        # Centro de la llama (amarillo)
        inner_flame_height = flame_height * 0.7
        inner_flame_width = flame_width * 0.7
        inner_flame_x = flame_x + (flame_width - inner_flame_width) / 2
        inner_flame_y = flame_y + (flame_height - inner_flame_height) / 2
        draw.ellipse([inner_flame_x, inner_flame_y, 
                      inner_flame_x + inner_flame_width, inner_flame_y + inner_flame_height], 
                    fill=COLORS['yellow'])
        
        # Núcleo de la llama (blanco, más irregular en cada frame)
        core_size = 2 + (i % 2)
        core_offset_x = -1 + i
        core_offset_y = -1 + (i % 2)
        draw.ellipse([flame_x + flame_width/2 - core_size + core_offset_x, 
                      flame_y + flame_height/2 - core_size + core_offset_y,
                      flame_x + flame_width/2 + core_size + core_offset_x, 
                      flame_y + flame_height/2 + core_size + core_offset_y], 
                    fill=COLORS['white'])
    
    # Impacto de la antorcha (explosión de fuego, 4 frames)
    for i in range(4):
        # Coordenadas del frame actual
        x = (i + 3) * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Radio de la explosión (aumenta con cada frame)
        radius = 5 + i * 3
        
        # Dibujar la explosión principal (naranja)
        draw.ellipse([
            center_x - radius, center_y - radius,
            center_x + radius, center_y + radius
        ], fill=COLORS['orange'])
        
        # Centro de la explosión (amarillo)
        inner_radius = radius * 0.7
        draw.ellipse([
            center_x - inner_radius, center_y - inner_radius,
            center_x + inner_radius, center_y + inner_radius
        ], fill=COLORS['yellow'])
        
        # Núcleo de la explosión (blanco)
        core_radius = inner_radius * 0.5
        draw.ellipse([
            center_x - core_radius, center_y - core_radius,
            center_x + core_radius, center_y + core_radius
        ], fill=COLORS['white'])
        
        # Partículas de fuego (puntos brillantes alrededor)
        num_particles = 8 + i * 2
        for j in range(num_particles):
            angle = math.radians((360 / num_particles) * j)
            distance = radius + 2 + i * 2 + (j % 3)
            particle_x = center_x + distance * math.cos(angle)
            particle_y = center_y + distance * math.sin(angle)
            particle_size = 1 + (j % 2)
            
            # Alternar colores
            particle_color = COLORS['yellow'] if j % 3 == 0 else (
                COLORS['orange'] if j % 3 == 1 else COLORS['white'])
            
            draw.ellipse([
                particle_x - particle_size, particle_y - particle_size,
                particle_x + particle_size, particle_y + particle_size
            ], fill=particle_color)
    
    # Guardar la imagen
    torch_path = os.path.join(weapons_dir, 'Torch.png')
    torch_img.save(torch_path)
    print(f"Sprite de antorcha creado en {torch_path}")
    return torch_path

# 4. HACHA (AXE)
def create_axe_sprite():
    """Crea el sprite para el hacha con 6 frames: 3 para vuelo, 3 para impacto"""
    # Dimensiones: 192x32 (6 frames de 32x32)
    axe_img = create_transparent_image(FRAME_SIZE * 6, FRAME_SIZE)
    draw = ImageDraw.Draw(axe_img)
    
    # Vuelo del hacha (3 frames con rotación)
    angles = [0, 45, 90]  # Ángulos para la rotación
    
    for i, angle in enumerate(angles):
        # Coordenadas del frame actual
        x = i * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Mango del hacha
        handle_length = 14
        rad_angle = math.radians(angle)
        
        handle_x1 = center_x - (handle_length/2) * math.cos(rad_angle)
        handle_y1 = center_y - (handle_length/2) * math.sin(rad_angle)
        handle_x2 = center_x + (handle_length/2) * math.cos(rad_angle)
        handle_y2 = center_y + (handle_length/2) * math.sin(rad_angle)
        
        # Dibujar el mango
        draw.line([handle_x1, handle_y1, handle_x2, handle_y2], fill=COLORS['wood'], width=2)
        
        # Dibujar la cabeza del hacha
        blade_angle = rad_angle + math.pi/2  # Perpendicular al mango
        blade_size = 8
        
        # Posición de la cabeza del hacha
        blade_center_x = handle_x2
        blade_center_y = handle_y2
        
        # Puntos para la forma del hacha
        blade_points = [
            (blade_center_x, blade_center_y),
            (blade_center_x + blade_size * math.cos(blade_angle), 
             blade_center_y + blade_size * math.sin(blade_angle)),
            (blade_center_x + (blade_size/2) * math.cos(rad_angle) + blade_size * math.cos(blade_angle), 
             blade_center_y + (blade_size/2) * math.sin(rad_angle) + blade_size * math.sin(blade_angle)),
            (blade_center_x + (blade_size/2) * math.cos(rad_angle), 
             blade_center_y + (blade_size/2) * math.sin(rad_angle)),
            (blade_center_x - blade_size * math.cos(blade_angle), 
             blade_center_y - blade_size * math.sin(blade_angle)),
            (blade_center_x, blade_center_y)
        ]
        
        # Dibujar la hoja del hacha
        draw.polygon(blade_points, fill=COLORS['metal'], outline=COLORS['dark_gray'])
        
        # Añadir un brillo al filo
        edge_points = [
            (blade_center_x + blade_size * math.cos(blade_angle), 
             blade_center_y + blade_size * math.sin(blade_angle)),
            (blade_center_x + (blade_size/2) * math.cos(rad_angle) + blade_size * math.cos(blade_angle), 
             blade_center_y + (blade_size/2) * math.sin(rad_angle) + blade_size * math.sin(blade_angle)),
            (blade_center_x + (blade_size/2) * math.cos(rad_angle), 
             blade_center_y + (blade_size/2) * math.sin(rad_angle))
        ]
        draw.line([edge_points[0], edge_points[1], edge_points[2]], fill=COLORS['light_gray'], width=1)
    
    # Impacto del hacha (3 frames)
    for i in range(3):
        # Coordenadas del frame actual
        x = (i + 3) * FRAME_SIZE
        y = 0
        center_x = x + FRAME_SIZE // 2
        center_y = y + FRAME_SIZE // 2
        
        # Brillo central del impacto
        radius = 3 + i
        draw.ellipse([
            center_x - radius, center_y - radius,
            center_x + radius, center_y + radius
        ], fill=COLORS['light_yellow'])
        
        # Fragmentos metálicos (líneas que salen del centro)
        num_fragments = 6 + i * 2
        for j in range(num_fragments):
            angle = math.radians((360 / num_fragments) * j)
            length = 4 + i * 2 + (j % 3)
            frag_x = center_x + length * math.cos(angle)
            frag_y = center_y + length * math.sin(angle)
            
            # Color del fragmento
            frag_color = COLORS['metal'] if j % 2 == 0 else COLORS['light_gray']
            
            draw.line([center_x, center_y, frag_x, frag_y], fill=frag_color, width=1)
        
        # Chispas (pequeños puntos amarillos/blancos)
        num_sparks = 8 + i * 3
        for j in range(num_sparks):
            angle = math.radians((360 / num_sparks) * j + (i * 10))  # Rotación con cada frame
            distance = 7 + i * 2 + (j % 4)
            spark_x = center_x + distance * math.cos(angle)
            spark_y = center_y + distance * math.sin(angle)
            spark_size = 1
            
            # Color de la chispa
            spark_color = COLORS['yellow'] if j % 3 == 0 else COLORS['white']
            
            if j % 5 != 0:  # No dibujar todas las chispas para dar un efecto aleatorio
                draw.point([spark_x, spark_y], fill=spark_color)
                if j % 3 == 0:  # Algunas chispas son más grandes
                    draw.ellipse([
                        spark_x - spark_size, spark_y - spark_size,
                        spark_x + spark_size, spark_y + spark_size
                    ], fill=spark_color)
    
    # Guardar la imagen
    axe_path = os.path.join(weapons_dir, 'Axe.png')
    axe_img.save(axe_path)
    print(f"Sprite de hacha creado en {axe_path}")
    return axe_path

# Crear todos los sprites
def create_all_weapons():
    print("Generando sprites de armas...")
    create_spear_sprite()
    create_dagger_sprite()
    create_torch_sprite()
    create_axe_sprite()
    print("¡Todos los sprites de armas han sido generados!")

if __name__ == "__main__":
    create_all_weapons() 