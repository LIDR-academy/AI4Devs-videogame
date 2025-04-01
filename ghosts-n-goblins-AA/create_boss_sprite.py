from PIL import Image, ImageDraw
import os
import math
import random

# Asegurar que el directorio existe
boss_dir = 'ghosts-n-goblins/assets/images/Boss'
os.makedirs(boss_dir, exist_ok=True)

# Definir colores
COLORS = {
    'body_dark': (150, 20, 20),
    'body': (200, 30, 30),
    'body_light': (230, 60, 60),
    'wing_dark': (80, 0, 0),
    'wing': (120, 10, 10),
    'horn_dark': (70, 70, 70),
    'horn': (100, 100, 100),
    'eye': (255, 255, 0),
    'eye_pupil': (0, 0, 0),
    'fire': (255, 140, 0),
    'fire_dark': (200, 60, 0),
    'transparent': (0, 0, 0, 0),
    'black': (0, 0, 0),
    'white': (255, 255, 255),
    'energy_blue': (50, 50, 255),
    'energy_purple': (150, 0, 150),
    'flame_yellow': (255, 200, 0),
}

# Crear una imagen transparente
def create_transparent_image(width, height):
    return Image.new('RGBA', (width, height), COLORS['transparent'])

# Función para dibujar el cuerpo del demonio
def draw_demon_body(draw, x, y, width, height, frame=0):
    # Calcular parámetros para la animación
    time_factor = frame / 10
    wave = math.sin(time_factor * 2 * math.pi)
    wave_small = math.sin(time_factor * 4 * math.pi)
    
    # Centro del cuerpo
    cx = x + width / 2
    cy = y + height / 2
    
    # Dibujar el cuerpo principal (forma ovalada)
    body_width = width * 0.7
    body_height = height * 0.6
    body_x = cx - body_width / 2
    body_y = cy - body_height / 2 + wave * height * 0.05
    
    # Cuerpo principal
    draw.ellipse([body_x, body_y, body_x + body_width, body_y + body_height], 
                fill=COLORS['body'], outline=COLORS['body_dark'])
    
    # Sombras y reflejos en el cuerpo para darle volumen
    highlight_width = body_width * 0.7
    highlight_height = body_height * 0.5
    highlight_x = body_x + (body_width - highlight_width) / 2
    highlight_y = body_y + (body_height - highlight_height) / 3
    
    # Reflejo sutil en la parte superior
    draw.ellipse([highlight_x, highlight_y, highlight_x + highlight_width, highlight_y + highlight_height], 
                fill=COLORS['body_light'])
    
    # Cuernos (dependiendo de la animación, pueden inclinarse ligeramente)
    horn_tilt = wave_small * 0.2
    
    # Cuerno izquierdo
    horn_left_points = [
        (body_x + body_width * 0.25, body_y + body_height * 0.2),
        (body_x + body_width * 0.15 - horn_tilt * 10, body_y - body_height * 0.3),
        (body_x + body_width * 0.25 + horn_tilt * 5, body_y - body_height * 0.1),
        (body_x + body_width * 0.3, body_y + body_height * 0.1)
    ]
    draw.polygon(horn_left_points, fill=COLORS['horn'], outline=COLORS['horn_dark'])
    
    # Cuerno derecho
    horn_right_points = [
        (body_x + body_width * 0.75, body_y + body_height * 0.2),
        (body_x + body_width * 0.85 + horn_tilt * 10, body_y - body_height * 0.3),
        (body_x + body_width * 0.75 - horn_tilt * 5, body_y - body_height * 0.1),
        (body_x + body_width * 0.7, body_y + body_height * 0.1)
    ]
    draw.polygon(horn_right_points, fill=COLORS['horn'], outline=COLORS['horn_dark'])
    
    # Ojos (pueden cambiar de tamaño según la animación)
    eye_size = body_width * 0.12 * (1 + wave_small * 0.3)
    
    # Ojo izquierdo
    eye_left_x = body_x + body_width * 0.3
    eye_left_y = body_y + body_height * 0.25
    draw.ellipse([eye_left_x - eye_size/2, eye_left_y - eye_size/2, 
                 eye_left_x + eye_size/2, eye_left_y + eye_size/2], 
                fill=COLORS['eye'], outline=COLORS['black'])
    
    # Pupila izquierda (puede moverse un poco)
    pupil_offset_x = wave_small * eye_size * 0.2
    pupil_offset_y = wave * eye_size * 0.2
    pupil_size = eye_size * 0.4
    draw.ellipse([eye_left_x - pupil_size/2 + pupil_offset_x, 
                 eye_left_y - pupil_size/2 + pupil_offset_y, 
                 eye_left_x + pupil_size/2 + pupil_offset_x, 
                 eye_left_y + pupil_size/2 + pupil_offset_y], 
                fill=COLORS['eye_pupil'])
    
    # Ojo derecho
    eye_right_x = body_x + body_width * 0.7
    eye_right_y = body_y + body_height * 0.25
    draw.ellipse([eye_right_x - eye_size/2, eye_right_y - eye_size/2, 
                 eye_right_x + eye_size/2, eye_right_y + eye_size/2], 
                fill=COLORS['eye'], outline=COLORS['black'])
    
    # Pupila derecha
    draw.ellipse([eye_right_x - pupil_size/2 + pupil_offset_x, 
                 eye_right_y - pupil_size/2 + pupil_offset_y, 
                 eye_right_x + pupil_size/2 + pupil_offset_x, 
                 eye_right_y + pupil_size/2 + pupil_offset_y], 
                fill=COLORS['eye_pupil'])
    
    # Boca (puede abrirse y cerrarse según la animación)
    mouth_width = body_width * 0.5
    mouth_height = max(1, body_height * 0.1 * (1 + wave * 2))  # Asegurar que la altura sea al menos 1 píxel
    mouth_x = body_x + (body_width - mouth_width) / 2
    mouth_y = body_y + body_height * 0.6
    
    # Asegurar que y1 > y0 para la elipse de la boca
    draw.ellipse([mouth_x, mouth_y, mouth_x + mouth_width, mouth_y + mouth_height], 
                fill=COLORS['black'], outline=None)
    
    # Si la boca está más abierta, mostrar fuego dentro
    if mouth_height > body_height * 0.15:
        fire_height = max(1, mouth_height * 0.8)  # Asegurar que la altura sea al menos 1 píxel
        fire_width = mouth_width * 0.7
        fire_x = mouth_x + (mouth_width - fire_width) / 2
        fire_y = mouth_y + (mouth_height - fire_height) / 2
        
        draw.ellipse([fire_x, fire_y, fire_x + fire_width, fire_y + fire_height], 
                    fill=COLORS['fire'], outline=COLORS['fire_dark'])
    
    return body_x, body_y, body_width, body_height

# Función para dibujar las alas del demonio
def draw_demon_wings(draw, body_x, body_y, body_width, body_height, frame=0):
    # Calcular parámetros para la animación
    time_factor = frame / 10
    wing_flap = math.sin(time_factor * 2 * math.pi)
    
    # Alas más extendidas o recogidas según la animación
    wing_extension = 0.7 + wing_flap * 0.3
    
    # Ala izquierda
    wing_left_points = [
        (body_x + body_width * 0.2, body_y + body_height * 0.3),
        (body_x - body_width * wing_extension, body_y - body_height * 0.1 * wing_extension),
        (body_x - body_width * wing_extension * 0.8, body_y + body_height * 0.1),
        (body_x - body_width * wing_extension * 0.7, body_y + body_height * 0.4),
        (body_x - body_width * wing_extension * 0.5, body_y + body_height * 0.7),
        (body_x + body_width * 0.1, body_y + body_height * 0.6)
    ]
    draw.polygon(wing_left_points, fill=COLORS['wing'], outline=COLORS['wing_dark'])
    
    # Detalle del ala izquierda
    for i in range(1, 4):
        draw.line([wing_left_points[0], 
                  (wing_left_points[i][0] * 0.7 + wing_left_points[0][0] * 0.3, 
                   wing_left_points[i][1] * 0.7 + wing_left_points[0][1] * 0.3)], 
                 fill=COLORS['wing_dark'], width=1)
    
    # Ala derecha
    wing_right_points = [
        (body_x + body_width * 0.8, body_y + body_height * 0.3),
        (body_x + body_width + body_width * wing_extension, body_y - body_height * 0.1 * wing_extension),
        (body_x + body_width + body_width * wing_extension * 0.8, body_y + body_height * 0.1),
        (body_x + body_width + body_width * wing_extension * 0.7, body_y + body_height * 0.4),
        (body_x + body_width + body_width * wing_extension * 0.5, body_y + body_height * 0.7),
        (body_x + body_width * 0.9, body_y + body_height * 0.6)
    ]
    draw.polygon(wing_right_points, fill=COLORS['wing'], outline=COLORS['wing_dark'])
    
    # Detalle del ala derecha
    for i in range(1, 4):
        draw.line([wing_right_points[0], 
                  (wing_right_points[i][0] * 0.7 + wing_right_points[0][0] * 0.3, 
                   wing_right_points[i][1] * 0.7 + wing_right_points[0][1] * 0.3)], 
                 fill=COLORS['wing_dark'], width=1)

# Función para dibujar efectos de fuego/energía
def draw_energy_effects(draw, x, y, width, height, frame=0):
    # Calcular parámetros para la animación
    time_factor = frame / 10
    wave = math.sin(time_factor * 2 * math.pi)
    
    # Centro
    cx = x + width / 2
    cy = y + height / 2
    
    # Aura de energía
    for i in range(5, 0, -1):
        radius = width * 0.1 * i * (0.8 + wave * 0.2)
        alpha = int(100 * (1 - i/5) + wave * 50)
        color = (*COLORS['energy_purple'][:3], alpha)
        
        # Posición aleatoria ligeramente desplazada para efecto de energía inestable
        offset_x = (random.random() - 0.5) * width * 0.1
        offset_y = (random.random() - 0.5) * height * 0.1
        
        draw.ellipse([cx - radius + offset_x, cy - radius + offset_y, 
                      cx + radius + offset_x, cy + radius + offset_y], 
                    fill=color)
    
    # Pequeños orbes de energía alrededor
    num_orbs = 3 + int(wave * 2)
    for i in range(num_orbs):
        angle = i * 2 * math.pi / num_orbs + time_factor * math.pi
        distance = width * 0.6 * (0.8 + wave * 0.2)
        orb_x = cx + math.cos(angle) * distance
        orb_y = cy + math.sin(angle) * distance
        orb_size = width * 0.08 * (0.7 + wave * 0.3)
        
        # Orbe con resplandor
        for j in range(3, 0, -1):
            orb_radius = orb_size * j / 3
            alpha = int(100 * (1 - j/3) + wave * 50)
            color = (*COLORS['energy_blue'][:3], alpha)
            
            draw.ellipse([orb_x - orb_radius, orb_y - orb_radius, 
                          orb_x + orb_radius, orb_y + orb_radius], 
                        fill=color)

# Función para crear un frame del jefe
def create_boss_frame(frame_index, frame_size=128):
    img = create_transparent_image(frame_size, frame_size)
    draw = ImageDraw.Draw(img)
    
    # Dibujar las diferentes partes
    body_x, body_y, body_width, body_height = draw_demon_body(
        draw, 
        frame_size * 0.2,  # x 
        frame_size * 0.25, # y
        frame_size * 0.6,  # width
        frame_size * 0.5,  # height
        frame_index
    )
    
    # Dibujar alas
    draw_demon_wings(draw, body_x, body_y, body_width, body_height, frame_index)
    
    # Dibujar efectos de energía en frames específicos
    if frame_index % 3 == 0:
        draw_energy_effects(draw, 0, 0, frame_size, frame_size, frame_index)
    
    return img

# Crear spritesheet para la animación de vuelo del jefe
def create_boss_flying_spritesheet(num_frames=8, frame_size=128):
    # Crear imagen para el spritesheet
    spritesheet_width = frame_size * num_frames
    spritesheet_height = frame_size
    spritesheet = create_transparent_image(spritesheet_width, spritesheet_height)
    
    # Generar cada frame
    for i in range(num_frames):
        frame = create_boss_frame(i, frame_size)
        spritesheet.paste(frame, (i * frame_size, 0), frame)
    
    # Guardar el spritesheet
    file_path = os.path.join(boss_dir, 'boss_flying.png')
    spritesheet.save(file_path)
    print(f"Spritesheet de vuelo del jefe creado en {file_path}")
    return file_path

# Función para crear un frame de ataque del jefe
def create_boss_attack_frame(frame_index, frame_size=128):
    img = create_transparent_image(frame_size, frame_size)
    draw = ImageDraw.Draw(img)
    
    # Dibujar el cuerpo y las alas como base
    body_x, body_y, body_width, body_height = draw_demon_body(
        draw, 
        frame_size * 0.2,
        frame_size * 0.25,
        frame_size * 0.6,
        frame_size * 0.5,
        frame_index
    )
    
    draw_demon_wings(draw, body_x, body_y, body_width, body_height, frame_index)
    
    # Calcular parámetros para la animación
    time_factor = frame_index / 6
    wave = math.sin(time_factor * 2 * math.pi)
    
    # La boca siempre abierta durante el ataque
    mouth_width = body_width * 0.5
    mouth_height = max(1, body_height * 0.25 * (1 + wave * 0.5))
    mouth_x = body_x + (body_width - mouth_width) / 2
    mouth_y = body_y + body_height * 0.55
    
    draw.ellipse([mouth_x, mouth_y, mouth_x + mouth_width, mouth_y + mouth_height], 
                fill=COLORS['black'], outline=None)
    
    # Fuego saliendo de la boca
    fire_width = mouth_width + wave * body_width * 0.5
    fire_height = max(1, mouth_height * 1.5)
    fire_x = mouth_x + mouth_width / 2 - fire_width / 2
    fire_y = mouth_y + mouth_height * 0.5
    
    # Base del fuego
    draw.ellipse([fire_x, fire_y, fire_x + fire_width, fire_y + fire_height], 
                fill=COLORS['fire'], outline=COLORS['fire_dark'])
    
    # Parte central más brillante
    inner_fire_width = fire_width * 0.7
    inner_fire_height = max(1, fire_height * 0.7)
    inner_fire_x = fire_x + (fire_width - inner_fire_width) / 2
    inner_fire_y = fire_y + (fire_height - inner_fire_height) / 2
    
    draw.ellipse([inner_fire_x, inner_fire_y, inner_fire_x + inner_fire_width, inner_fire_y + inner_fire_height], 
                fill=COLORS['flame_yellow'])
    
    # Proyectil de fuego si está en la fase correcta de la animación
    if frame_index >= 4:
        projectile_x = fire_x + fire_width + (frame_index - 4) * frame_size * 0.1
        projectile_y = fire_y + fire_height / 2
        projectile_size = body_width * 0.2
        
        # Dibujar el proyectil
        draw.ellipse([projectile_x - projectile_size/2, projectile_y - projectile_size/2, 
                      projectile_x + projectile_size/2, projectile_y + projectile_size/2], 
                    fill=COLORS['fire'], outline=COLORS['fire_dark'])
        
        # Estela de fuego detrás del proyectil
        for i in range(3):
            trail_x = projectile_x - (i + 1) * projectile_size * 0.6
            trail_size = projectile_size * (1 - i * 0.2)
            alpha = int(200 * (1 - i * 0.3))
            trail_color = (*COLORS['fire'][:3], alpha)
            
            draw.ellipse([trail_x - trail_size/2, projectile_y - trail_size/2, 
                          trail_x + trail_size/2, projectile_y + trail_size/2], 
                        fill=trail_color)
    
    return img

# Crear spritesheet para la animación de ataque del jefe
def create_boss_attack_spritesheet(num_frames=8, frame_size=128):
    # Crear imagen para el spritesheet
    spritesheet_width = frame_size * num_frames
    spritesheet_height = frame_size
    spritesheet = create_transparent_image(spritesheet_width, spritesheet_height)
    
    # Generar cada frame
    for i in range(num_frames):
        frame = create_boss_attack_frame(i, frame_size)
        spritesheet.paste(frame, (i * frame_size, 0), frame)
    
    # Guardar el spritesheet
    file_path = os.path.join(boss_dir, 'boss_attack.png')
    spritesheet.save(file_path)
    print(f"Spritesheet de ataque del jefe creado en {file_path}")
    return file_path

# Función para crear un frame de la muerte del jefe
def create_boss_death_frame(frame_index, frame_size=128):
    img = create_transparent_image(frame_size, frame_size)
    draw = ImageDraw.Draw(img)
    
    # Calcular parámetros para la animación
    # A medida que avanza la animación, el jefe se desvanece y se fragmenta
    progress = frame_index / 7  # Asumiendo 8 frames en total (0-7)
    
    # Dibujar el cuerpo y las alas solo si no ha avanzado mucho la animación
    if progress < 0.7:
        # El demonio se encoge y se inclina al morir
        scale = 1.0 - progress * 0.3
        tilt = progress * 0.2
        
        # Posición ajustada
        pos_x = frame_size * (0.2 + progress * 0.1)
        pos_y = frame_size * (0.25 + progress * 0.15)
        
        body_x, body_y, body_width, body_height = draw_demon_body(
            draw, 
            pos_x,
            pos_y,
            frame_size * 0.6 * scale,
            frame_size * 0.5 * scale,
            frame_index
        )
        
        if progress < 0.5:
            draw_demon_wings(draw, body_x, body_y, body_width, body_height, frame_index)
    
    # Añadir efectos de explosión/desintegración
    cx = frame_size * 0.5
    cy = frame_size * 0.5
    
    # Explosión central que crece con el tiempo
    explosion_size = frame_size * 0.2 * progress
    
    for i in range(5, 0, -1):
        radius = explosion_size * i / 3
        alpha = int(200 * (1 - i/5) - progress * 100)
        if alpha > 0:
            color = (*COLORS['fire'][:3], alpha)
            draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color)
    
    # Partículas que salen disparadas
    num_particles = int(20 * progress)
    for i in range(num_particles):
        angle = random.random() * 2 * math.pi
        distance = frame_size * 0.4 * progress * random.random()
        particle_x = cx + math.cos(angle) * distance
        particle_y = cy + math.sin(angle) * distance
        particle_size = frame_size * 0.03 * (1 - progress * 0.5) * (0.5 + random.random())
        
        # Color aleatorio para partículas (entre rojo y naranja)
        r = random.randint(200, 255)
        g = random.randint(50, 150)
        b = 0
        alpha = int(255 * (1 - progress))
        particle_color = (r, g, b, alpha)
        
        draw.ellipse([particle_x - particle_size, particle_y - particle_size, 
                      particle_x + particle_size, particle_y + particle_size], 
                    fill=particle_color)
    
    return img

# Crear spritesheet para la animación de muerte del jefe
def create_boss_death_spritesheet(num_frames=8, frame_size=128):
    # Crear imagen para el spritesheet
    spritesheet_width = frame_size * num_frames
    spritesheet_height = frame_size
    spritesheet = create_transparent_image(spritesheet_width, spritesheet_height)
    
    # Generar cada frame
    for i in range(num_frames):
        frame = create_boss_death_frame(i, frame_size)
        spritesheet.paste(frame, (i * frame_size, 0), frame)
    
    # Guardar el spritesheet
    file_path = os.path.join(boss_dir, 'boss_death.png')
    spritesheet.save(file_path)
    print(f"Spritesheet de muerte del jefe creado en {file_path}")
    return file_path

# Función para crear proyectiles del jefe
def create_boss_fireball():
    # Tamaño del proyectil
    size = 32
    img = create_transparent_image(size, size)
    draw = ImageDraw.Draw(img)
    
    # Centro del proyectil
    cx = size / 2
    cy = size / 2
    
    # Dibujar el núcleo de fuego
    for i in range(3, 0, -1):
        radius = size / 2 * i / 3
        color = COLORS['fire'] if i > 1 else COLORS['flame_yellow']
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color)
    
    # Guardar la imagen
    file_path = os.path.join(boss_dir, 'boss_fireball.png')
    img.save(file_path)
    print(f"Proyectil del jefe creado en {file_path}")
    return file_path

# Crear todos los sprites
def create_all_boss_sprites():
    print("Generando sprites del jefe final...")
    
    # Spritesheets para diferentes animaciones
    create_boss_flying_spritesheet()
    create_boss_attack_spritesheet()
    create_boss_death_spritesheet()
    
    # Proyectil
    create_boss_fireball()
    
    print("¡Todos los sprites del jefe han sido generados!")

if __name__ == "__main__":
    create_all_boss_sprites() 