from PIL import Image, ImageDraw
import os
import math  # Necesario para funciones trigonométricas en draw_demon_attack y draw_fireball

# Asegurar que existe el directorio para guardar los sprites
output_dir = 'ghosts-n-goblins/assets/sprites/enemies'
os.makedirs(output_dir, exist_ok=True)

# Colores para el demonio
RED = (180, 30, 30)
DARK_RED = (140, 20, 20)
FIRE_ORANGE = (255, 100, 0)
FIRE_YELLOW = (255, 200, 0)
BLACK = (20, 20, 20)
BG_COLOR = (0, 0, 0, 0)  # Transparente
EYE_COLOR = (255, 255, 0)  # Ojos amarillos brillantes

def create_base_image(width, height):
    """Crea una imagen base transparente"""
    return Image.new('RGBA', (width, height), BG_COLOR)

def draw_demon_standing(img):
    """Dibuja un demonio en posición estándar"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Centro de la imagen
    center_x = width // 2
    center_y = height // 3
    
    # Cuerpo principal
    body_width = width // 3
    body_height = height // 2.5
    draw.ellipse((center_x - body_width//2, center_y - body_height//2, 
                  center_x + body_width//2, center_y + body_height//2), 
                 fill=RED, outline=DARK_RED)
    
    # Cabeza
    head_size = body_width // 1.5
    head_y = center_y - body_height//2 - head_size//2
    draw.ellipse((center_x - head_size//2, head_y - head_size//2,
                  center_x + head_size//2, head_y + head_size//2),
                 fill=RED, outline=DARK_RED)
    
    # Ojos (amarillos y brillantes)
    eye_size = head_size // 4
    left_eye_x = center_x - head_size//4
    right_eye_x = center_x + head_size//4
    eye_y = head_y - eye_size//2
    
    # Ojo izquierdo
    draw.ellipse((left_eye_x - eye_size//2, eye_y - eye_size//2,
                  left_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=EYE_COLOR, outline=BLACK)
    
    # Ojo derecho
    draw.ellipse((right_eye_x - eye_size//2, eye_y - eye_size//2,
                  right_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=EYE_COLOR, outline=BLACK)
    
    # Cuernos
    horn_length = head_size // 1.2
    horn_width = horn_length // 3
    
    # Cuerno izquierdo
    draw.polygon([
        (center_x - head_size//3, head_y - head_size//3),  # Base
        (center_x - head_size - horn_length//2, head_y - head_size),  # Punta
        (center_x - head_size//3, head_y)                  # Base inferior
    ], fill=DARK_RED, outline=BLACK)
    
    # Cuerno derecho
    draw.polygon([
        (center_x + head_size//3, head_y - head_size//3),  # Base
        (center_x + head_size + horn_length//2, head_y - head_size),  # Punta
        (center_x + head_size//3, head_y)                  # Base inferior
    ], fill=DARK_RED, outline=BLACK)
    
    # Boca (sonrisa amenazante)
    mouth_y = head_y + head_size//4
    draw.arc((center_x - head_size//3, mouth_y - head_size//6,
              center_x + head_size//3, mouth_y + head_size//6),
             0, 180, fill=BLACK, width=2)
    
    # Dientes
    tooth_width = head_size // 12
    tooth_height = head_size // 8
    for i in range(-2, 3):
        tooth_x = center_x + i * tooth_width
        draw.polygon([
            (tooth_x - tooth_width//2, mouth_y),
            (tooth_x, mouth_y + tooth_height),
            (tooth_x + tooth_width//2, mouth_y)
        ], fill=(255, 255, 255), outline=BLACK)
    
    # Alas
    wing_width = width // 2.2
    wing_height = height // 2.5
    
    # Ala izquierda
    left_wing_x = center_x - body_width//2
    left_wing_y = center_y
    draw.polygon([
        (left_wing_x, left_wing_y - body_height//4),  # Punto superior de conexión
        (left_wing_x - wing_width, left_wing_y - wing_height//2),  # Punta superior
        (left_wing_x - wing_width//1.2, left_wing_y),  # Punto medio
        (left_wing_x - wing_width//1.5, left_wing_y + wing_height//2),  # Punta inferior
        (left_wing_x, left_wing_y + body_height//4)  # Punto inferior de conexión
    ], fill=RED, outline=DARK_RED)
    
    # Membrana del ala izquierda
    for i in range(1, 4):
        factor = i / 4
        draw.line(
            [(left_wing_x, left_wing_y - body_height//4 + i * body_height//8),
             (left_wing_x - wing_width * factor, left_wing_y - wing_height//2 + i * wing_height//3)],
            fill=DARK_RED, width=2
        )
    
    # Ala derecha
    right_wing_x = center_x + body_width//2
    right_wing_y = center_y
    draw.polygon([
        (right_wing_x, right_wing_y - body_height//4),  # Punto superior de conexión
        (right_wing_x + wing_width, right_wing_y - wing_height//2),  # Punta superior
        (right_wing_x + wing_width//1.2, right_wing_y),  # Punto medio
        (right_wing_x + wing_width//1.5, right_wing_y + wing_height//2),  # Punta inferior
        (right_wing_x, right_wing_y + body_height//4)  # Punto inferior de conexión
    ], fill=RED, outline=DARK_RED)
    
    # Membrana del ala derecha
    for i in range(1, 4):
        factor = i / 4
        draw.line(
            [(right_wing_x, right_wing_y - body_height//4 + i * body_height//8),
             (right_wing_x + wing_width * factor, right_wing_y - wing_height//2 + i * wing_height//3)],
            fill=DARK_RED, width=2
        )
    
    # Piernas
    leg_length = body_height * 0.8
    leg_width = leg_length // 4
    
    # Pierna izquierda
    left_leg_x = center_x - body_width//4
    left_leg_y = center_y + body_height//2
    draw.line(
        [(left_leg_x, left_leg_y), (left_leg_x, left_leg_y + leg_length)],
        fill=RED, width=int(leg_width)
    )
    
    # Pezuña izquierda
    hoof_size = leg_width * 1.5
    draw.ellipse((left_leg_x - hoof_size//2, left_leg_y + leg_length - hoof_size//2,
                  left_leg_x + hoof_size//2, left_leg_y + leg_length + hoof_size//2),
                 fill=BLACK, outline=DARK_RED)
    
    # Pierna derecha
    right_leg_x = center_x + body_width//4
    right_leg_y = center_y + body_height//2
    draw.line(
        [(right_leg_x, right_leg_y), (right_leg_x, right_leg_y + leg_length)],
        fill=RED, width=int(leg_width)
    )
    
    # Pezuña derecha
    draw.ellipse((right_leg_x - hoof_size//2, right_leg_y + leg_length - hoof_size//2,
                  right_leg_x + hoof_size//2, right_leg_y + leg_length + hoof_size//2),
                 fill=BLACK, outline=DARK_RED)
    
    # Cola
    tail_length = body_height * 1.2
    tail_width = leg_width // 1.5
    
    # Puntos de control para la cola curva
    control_points = [
        (center_x, center_y + body_height//2),  # Inicio (conexión con el cuerpo)
        (center_x + body_width//2, center_y + body_height),  # Punto de control 1
        (center_x, center_y + body_height + tail_length//2),  # Punto de control 2
        (center_x - body_width//4, center_y + body_height + tail_length)  # Fin (punta de la cola)
    ]
    
    # Dibujar cola como una curva de Bézier
    for i in range(len(control_points) - 1):
        draw.line(
            [(control_points[i][0], control_points[i][1]), 
             (control_points[i+1][0], control_points[i+1][1])],
            fill=RED, width=int(tail_width - i * tail_width//4)
        )
    
    # Punta de la cola (tridente)
    tip_x = control_points[-1][0]
    tip_y = control_points[-1][1]
    tip_size = tail_width * 2
    
    # Punta central
    draw.polygon([
        (tip_x, tip_y),  # Base
        (tip_x - tip_size//2, tip_y + tip_size),  # Izquierda
        (tip_x + tip_size//2, tip_y + tip_size)  # Derecha
    ], fill=RED, outline=DARK_RED)
    
    # Puntas laterales
    draw.polygon([
        (tip_x, tip_y),  # Base
        (tip_x - tip_size, tip_y + tip_size//2),  # Izquierda
        (tip_x - tip_size//2, tip_y + tip_size//4)  # Centro
    ], fill=RED, outline=DARK_RED)
    
    draw.polygon([
        (tip_x, tip_y),  # Base
        (tip_x + tip_size, tip_y + tip_size//2),  # Derecha
        (tip_x + tip_size//2, tip_y + tip_size//4)  # Centro
    ], fill=RED, outline=DARK_RED)
    
    return img

def draw_demon_attack(img):
    """Dibuja un demonio en posición de ataque con fuego"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Centro de la imagen
    center_x = width // 2
    center_y = height // 3
    
    # Cuerpo principal
    body_width = width // 3
    body_height = height // 2.5
    draw.ellipse((center_x - body_width//2, center_y - body_height//2, 
                  center_x + body_width//2, center_y + body_height//2), 
                 fill=RED, outline=DARK_RED)
    
    # Cabeza
    head_size = body_width // 1.5
    head_y = center_y - body_height//2 - head_size//2
    draw.ellipse((center_x - head_size//2, head_y - head_size//2,
                  center_x + head_size//2, head_y + head_size//2),
                 fill=RED, outline=DARK_RED)
    
    # Ojos (más intensos durante el ataque)
    eye_size = head_size // 4
    left_eye_x = center_x - head_size//4
    right_eye_x = center_x + head_size//4
    eye_y = head_y - eye_size//2
    
    # Ojo izquierdo
    draw.ellipse((left_eye_x - eye_size//2, eye_y - eye_size//2,
                  left_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=FIRE_ORANGE, outline=BLACK)
    
    # Ojo derecho
    draw.ellipse((right_eye_x - eye_size//2, eye_y - eye_size//2,
                  right_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=FIRE_ORANGE, outline=BLACK)
    
    # Cuernos
    horn_length = head_size // 1.2
    horn_width = horn_length // 3
    
    # Cuerno izquierdo
    draw.polygon([
        (center_x - head_size//3, head_y - head_size//3),  # Base
        (center_x - head_size - horn_length//2, head_y - head_size),  # Punta
        (center_x - head_size//3, head_y)                  # Base inferior
    ], fill=DARK_RED, outline=BLACK)
    
    # Cuerno derecho
    draw.polygon([
        (center_x + head_size//3, head_y - head_size//3),  # Base
        (center_x + head_size + horn_length//2, head_y - head_size),  # Punta
        (center_x + head_size//3, head_y)                  # Base inferior
    ], fill=DARK_RED, outline=BLACK)
    
    # Boca (abierta para lanzar fuego)
    mouth_y = head_y + head_size//4
    mouth_width = head_size // 2
    mouth_height = head_size // 3
    draw.ellipse((center_x - mouth_width//2, mouth_y - mouth_height//2,
                  center_x + mouth_width//2, mouth_y + mouth_height//2),
                 fill=BLACK, outline=DARK_RED)
    
    # Dientes visibles alrededor de la boca
    tooth_width = head_size // 15
    tooth_height = head_size // 10
    for i in range(12):
        angle = i * 30  # 360 grados / 12 dientes
        angle_rad = math.radians(angle)
        tooth_x = center_x + math.cos(angle_rad) * mouth_width//2
        tooth_y = mouth_y + math.sin(angle_rad) * mouth_height//2
        
        # Calcular la dirección del diente (apuntando hacia afuera)
        dir_x = math.cos(angle_rad) * tooth_height
        dir_y = math.sin(angle_rad) * tooth_height
        
        draw.polygon([
            (tooth_x, tooth_y),  # Base del diente
            (tooth_x + dir_x, tooth_y + dir_y)  # Punta del diente
        ], fill=(255, 255, 255), width=tooth_width)
    
    # Fuego saliendo de la boca
    fire_length = head_size * 1.5
    fire_width = mouth_width * 1.2
    
    # Base del fuego (rojo)
    draw.polygon([
        (center_x, mouth_y),  # Origen en la boca
        (center_x - fire_width//2, mouth_y + fire_length//3),  # Expansión izquierda
        (center_x, mouth_y + fire_length//2),  # Punto medio
        (center_x + fire_width//2, mouth_y + fire_length//3)  # Expansión derecha
    ], fill=RED, outline=None)
    
    # Capa media del fuego (naranja)
    draw.polygon([
        (center_x, mouth_y + fire_length//6),  # Origen
        (center_x - fire_width//3, mouth_y + fire_length//2),  # Izquierda
        (center_x, mouth_y + fire_length * 2//3),  # Punto medio
        (center_x + fire_width//3, mouth_y + fire_length//2)  # Derecha
    ], fill=FIRE_ORANGE, outline=None)
    
    # Punta del fuego (amarilla)
    draw.polygon([
        (center_x, mouth_y + fire_length//3),  # Origen
        (center_x - fire_width//4, mouth_y + fire_length * 2//3),  # Izquierda
        (center_x, mouth_y + fire_length),  # Punto final
        (center_x + fire_width//4, mouth_y + fire_length * 2//3)  # Derecha
    ], fill=FIRE_YELLOW, outline=None)
    
    # Alas extendidas para el ataque
    wing_width = width // 2
    wing_height = height // 2.2
    
    # Ala izquierda
    left_wing_x = center_x - body_width//2
    left_wing_y = center_y
    draw.polygon([
        (left_wing_x, left_wing_y - body_height//4),  # Punto superior de conexión
        (left_wing_x - wing_width, left_wing_y - wing_height//2),  # Punta superior
        (left_wing_x - wing_width//1.2, left_wing_y),  # Punto medio
        (left_wing_x - wing_width//1.5, left_wing_y + wing_height//2),  # Punta inferior
        (left_wing_x, left_wing_y + body_height//4)  # Punto inferior de conexión
    ], fill=RED, outline=DARK_RED)
    
    # Membrana del ala izquierda
    for i in range(1, 4):
        factor = i / 4
        draw.line(
            [(left_wing_x, left_wing_y - body_height//4 + i * body_height//8),
             (left_wing_x - wing_width * factor, left_wing_y - wing_height//2 + i * wing_height//3)],
            fill=DARK_RED, width=2
        )
    
    # Ala derecha
    right_wing_x = center_x + body_width//2
    right_wing_y = center_y
    draw.polygon([
        (right_wing_x, right_wing_y - body_height//4),  # Punto superior de conexión
        (right_wing_x + wing_width, right_wing_y - wing_height//2),  # Punta superior
        (right_wing_x + wing_width//1.2, right_wing_y),  # Punto medio
        (right_wing_x + wing_width//1.5, right_wing_y + wing_height//2),  # Punta inferior
        (right_wing_x, right_wing_y + body_height//4)  # Punto inferior de conexión
    ], fill=RED, outline=DARK_RED)
    
    # Membrana del ala derecha
    for i in range(1, 4):
        factor = i / 4
        draw.line(
            [(right_wing_x, right_wing_y - body_height//4 + i * body_height//8),
             (right_wing_x + wing_width * factor, right_wing_y - wing_height//2 + i * wing_height//3)],
            fill=DARK_RED, width=2
        )
    
    # Resto del cuerpo similar a la posición estándar
    # Piernas
    leg_length = body_height * 0.8
    leg_width = leg_length // 4
    
    # Pierna izquierda
    left_leg_x = center_x - body_width//4
    left_leg_y = center_y + body_height//2
    draw.line(
        [(left_leg_x, left_leg_y), (left_leg_x, left_leg_y + leg_length)],
        fill=RED, width=int(leg_width)
    )
    
    # Pezuña izquierda
    hoof_size = leg_width * 1.5
    draw.ellipse((left_leg_x - hoof_size//2, left_leg_y + leg_length - hoof_size//2,
                  left_leg_x + hoof_size//2, left_leg_y + leg_length + hoof_size//2),
                 fill=BLACK, outline=DARK_RED)
    
    # Pierna derecha
    right_leg_x = center_x + body_width//4
    right_leg_y = center_y + body_height//2
    draw.line(
        [(right_leg_x, right_leg_y), (right_leg_x, right_leg_y + leg_length)],
        fill=RED, width=int(leg_width)
    )
    
    # Pezuña derecha
    draw.ellipse((right_leg_x - hoof_size//2, right_leg_y + leg_length - hoof_size//2,
                  right_leg_x + hoof_size//2, right_leg_y + leg_length + hoof_size//2),
                 fill=BLACK, outline=DARK_RED)
    
    return img

def draw_fireball(img):
    """Dibuja una bola de fuego para el ataque del demonio"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    center_x = width // 2
    center_y = height // 2
    
    # Capas de la bola de fuego
    radius = min(width, height) // 3
    
    # Núcleo (amarillo brillante)
    draw.ellipse((center_x - radius // 2, center_y - radius // 2,
                 center_x + radius // 2, center_y + radius // 2),
                fill=FIRE_YELLOW, outline=None)
    
    # Capa media (naranja)
    draw.ellipse((center_x - radius * 2 // 3, center_y - radius * 2 // 3,
                 center_x + radius * 2 // 3, center_y + radius * 2 // 3),
                fill=FIRE_ORANGE, outline=None)
    
    # Capa exterior (rojo)
    draw.ellipse((center_x - radius, center_y - radius,
                 center_x + radius, center_y + radius),
                fill=RED, outline=DARK_RED)
    
    # Llamas alrededor
    flame_count = 8
    flame_length = radius // 1.5
    
    for i in range(flame_count):
        angle = i * (360 // flame_count)
        angle_rad = math.radians(angle)
        
        # Punto de origen en el borde de la bola
        origin_x = center_x + math.cos(angle_rad) * radius
        origin_y = center_y + math.sin(angle_rad) * radius
        
        # Punta de la llama
        tip_x = center_x + math.cos(angle_rad) * (radius + flame_length)
        tip_y = center_y + math.sin(angle_rad) * (radius + flame_length)
        
        # Puntos laterales de la llama
        side_angle1 = math.radians(angle - 15)
        side_angle2 = math.radians(angle + 15)
        side_length = flame_length * 0.7
        
        side1_x = center_x + math.cos(side_angle1) * (radius + side_length)
        side1_y = center_y + math.sin(side_angle1) * (radius + side_length)
        
        side2_x = center_x + math.cos(side_angle2) * (radius + side_length)
        side2_y = center_y + math.sin(side_angle2) * (radius + side_length)
        
        # Dibujar la llama
        draw.polygon([
            (origin_x, origin_y),
            (side1_x, side1_y),
            (tip_x, tip_y),
            (side2_x, side2_y)
        ], fill=FIRE_ORANGE, outline=None)
    
    return img

def create_all_sprites():
    """Crear todos los sprites del demonio"""
    width, height = 128, 128
    
    # Sprite 1: Demonio en posición normal
    demon_standing = create_base_image(width, height)
    demon_standing = draw_demon_standing(demon_standing)
    demon_standing.save(f'{output_dir}/demon_standing.png')
    
    # Sprite 2: Demonio en ataque
    demon_attack = create_base_image(width, height)
    demon_attack = draw_demon_attack(demon_attack)
    demon_attack.save(f'{output_dir}/demon_attack.png')
    
    # Sprite 3: Bola de fuego (proyectil)
    fireball = create_base_image(64, 64)  # Más pequeño para el proyectil
    fireball = draw_fireball(fireball)
    fireball.save(f'{output_dir}/demon_fireball.png')
    
    print(f"Sprites de Demonio creados en {output_dir}:")
    print("- demon_standing.png")
    print("- demon_attack.png")
    print("- demon_fireball.png")

if __name__ == "__main__":
    create_all_sprites() 