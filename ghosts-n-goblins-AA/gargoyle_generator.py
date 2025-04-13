from PIL import Image, ImageDraw
import os

# Asegurar que existe el directorio para guardar los sprites
output_dir = 'ghosts-n-goblins/assets/sprites/enemies'
os.makedirs(output_dir, exist_ok=True)

# Colores para la gárgola
STONE_COLOR = (100, 100, 100)
DARK_STONE = (70, 70, 70)
WING_COLOR = (80, 80, 80)
EYE_COLOR = (255, 30, 30)  # Ojos rojos brillantes
BG_COLOR = (0, 0, 0, 0)    # Transparente

def create_base_image(width, height):
    """Crea una imagen base transparente"""
    return Image.new('RGBA', (width, height), BG_COLOR)

def draw_gargoyle_standing(img):
    """Dibuja una gárgola en posición de pie"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Centro de la imagen
    center_x = width // 2
    center_y = height // 3
    
    # Cuerpo principal (forma ovalada)
    body_width = width // 3
    body_height = height // 3
    draw.ellipse((center_x - body_width//2, center_y - body_height//2, 
                  center_x + body_width//2, center_y + body_height//2), 
                 fill=STONE_COLOR, outline=DARK_STONE)
    
    # Cabeza (más pequeña que el cuerpo)
    head_size = body_width // 2
    head_y = center_y - body_height//2 - head_size//2
    draw.ellipse((center_x - head_size//2, head_y - head_size//2,
                  center_x + head_size//2, head_y + head_size//2),
                 fill=STONE_COLOR, outline=DARK_STONE)
    
    # Ojos (rojos y brillantes)
    eye_size = head_size // 4
    left_eye_x = center_x - head_size//4
    right_eye_x = center_x + head_size//4
    eye_y = head_y - eye_size//2
    
    # Ojo izquierdo
    draw.ellipse((left_eye_x - eye_size//2, eye_y - eye_size//2,
                  left_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=EYE_COLOR, outline=DARK_STONE)
    
    # Ojo derecho
    draw.ellipse((right_eye_x - eye_size//2, eye_y - eye_size//2,
                  right_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=EYE_COLOR, outline=DARK_STONE)
    
    # Cuernos
    horn_length = head_size // 1.5
    horn_width = horn_length // 3
    
    # Cuerno izquierdo
    draw.polygon([
        (center_x - head_size//2, head_y - head_size//2),  # Base izquierda
        (center_x - head_size//2 - horn_length, head_y - head_size),  # Punta
        (center_x - head_size//2 + horn_width, head_y - head_size//2 + horn_width)  # Base derecha
    ], fill=STONE_COLOR, outline=DARK_STONE)
    
    # Cuerno derecho
    draw.polygon([
        (center_x + head_size//2, head_y - head_size//2),  # Base derecha
        (center_x + head_size//2 + horn_length, head_y - head_size),  # Punta
        (center_x + head_size//2 - horn_width, head_y - head_size//2 + horn_width)  # Base izquierda
    ], fill=STONE_COLOR, outline=DARK_STONE)
    
    # Alas desplegadas
    wing_width = width // 2
    wing_height = height // 3
    
    # Ala izquierda
    left_wing_x = center_x - body_width//2
    left_wing_y = center_y
    draw.polygon([
        (left_wing_x, left_wing_y),  # Punto de conexión con el cuerpo
        (left_wing_x - wing_width, left_wing_y - wing_height//2),  # Punta superior
        (left_wing_x - wing_width, left_wing_y + wing_height//2),  # Punta inferior
        (left_wing_x, left_wing_y + body_height//4)  # Punto inferior de conexión
    ], fill=WING_COLOR, outline=DARK_STONE)
    
    # Detalle de ala izquierda (costillas)
    for i in range(1, 4):
        factor = i / 4
        draw.line(
            [(left_wing_x, left_wing_y),
             (left_wing_x - wing_width * factor, left_wing_y - wing_height//2 * factor + wing_height//4)],
            fill=DARK_STONE, width=2
        )
    
    # Ala derecha
    right_wing_x = center_x + body_width//2
    right_wing_y = center_y
    draw.polygon([
        (right_wing_x, right_wing_y),  # Punto de conexión con el cuerpo
        (right_wing_x + wing_width, right_wing_y - wing_height//2),  # Punta superior
        (right_wing_x + wing_width, right_wing_y + wing_height//2),  # Punta inferior
        (right_wing_x, right_wing_y + body_height//4)  # Punto inferior de conexión
    ], fill=WING_COLOR, outline=DARK_STONE)
    
    # Detalle de ala derecha (costillas)
    for i in range(1, 4):
        factor = i / 4
        draw.line(
            [(right_wing_x, right_wing_y),
             (right_wing_x + wing_width * factor, right_wing_y - wing_height//2 * factor + wing_height//4)],
            fill=DARK_STONE, width=2
        )
    
    # Piernas
    leg_length = body_height
    leg_width = leg_length // 3
    
    # Pierna izquierda
    left_leg_x = center_x - body_width//4
    left_leg_y = center_y + body_height//2
    draw.rectangle((left_leg_x - leg_width//2, left_leg_y, 
                    left_leg_x + leg_width//2, left_leg_y + leg_length),
                   fill=STONE_COLOR, outline=DARK_STONE)
    
    # Pie izquierdo
    foot_width = leg_width * 1.5
    foot_height = leg_length // 4
    draw.rectangle((left_leg_x - foot_width//2, left_leg_y + leg_length, 
                    left_leg_x + foot_width//2, left_leg_y + leg_length + foot_height),
                   fill=STONE_COLOR, outline=DARK_STONE)
    
    # Pierna derecha
    right_leg_x = center_x + body_width//4
    right_leg_y = center_y + body_height//2
    draw.rectangle((right_leg_x - leg_width//2, right_leg_y, 
                    right_leg_x + leg_width//2, right_leg_y + leg_length),
                   fill=STONE_COLOR, outline=DARK_STONE)
    
    # Pie derecho
    draw.rectangle((right_leg_x - foot_width//2, right_leg_y + leg_length, 
                    right_leg_x + foot_width//2, right_leg_y + leg_length + foot_height),
                   fill=STONE_COLOR, outline=DARK_STONE)
    
    # Brazos
    arm_length = body_height * 0.7
    arm_width = leg_width // 1.5
    
    # Brazo izquierdo
    left_arm_x = center_x - body_width//2
    left_arm_y = center_y - body_height//4
    draw.line(
        [(left_arm_x, left_arm_y), (left_arm_x - arm_length, left_arm_y + arm_length)],
        fill=STONE_COLOR, width=int(arm_width)
    )
    
    # Garra izquierda
    claw_size = arm_width
    draw.polygon([
        (left_arm_x - arm_length, left_arm_y + arm_length),  # Base
        (left_arm_x - arm_length - claw_size, left_arm_y + arm_length - claw_size),  # Punta superior
        (left_arm_x - arm_length - claw_size, left_arm_y + arm_length + claw_size)   # Punta inferior
    ], fill=STONE_COLOR, outline=DARK_STONE)
    
    # Brazo derecho
    right_arm_x = center_x + body_width//2
    right_arm_y = center_y - body_height//4
    draw.line(
        [(right_arm_x, right_arm_y), (right_arm_x + arm_length, right_arm_y + arm_length)],
        fill=STONE_COLOR, width=int(arm_width)
    )
    
    # Garra derecha
    draw.polygon([
        (right_arm_x + arm_length, right_arm_y + arm_length),  # Base
        (right_arm_x + arm_length + claw_size, right_arm_y + arm_length - claw_size),  # Punta superior
        (right_arm_x + arm_length + claw_size, right_arm_y + arm_length + claw_size)   # Punta inferior
    ], fill=STONE_COLOR, outline=DARK_STONE)
    
    return img

def draw_gargoyle_stone(img):
    """Dibuja una gárgola en posición de piedra (defensiva)"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Centro de la imagen
    center_x = width // 2
    center_y = height // 2.5
    
    # Forma de piedra (más compacta)
    stone_width = width // 2.5
    stone_height = height // 2.5
    
    # Cuerpo principal (forma cuadrada como piedra)
    draw.rectangle((center_x - stone_width//2, center_y - stone_height//2,
                    center_x + stone_width//2, center_y + stone_height//2),
                   fill=STONE_COLOR, outline=DARK_STONE)
    
    # Detalles para dar apariencia de piedra
    for i in range(10):
        x = center_x - stone_width//2 + i * (stone_width // 10)
        y = center_y - stone_height//2 + (i % 3) * (stone_height // 3)
        size = stone_width // 15
        draw.rectangle((x, y, x + size, y + size), 
                       fill=DARK_STONE)
    
    # Ojos apenas visibles
    eye_size = stone_width // 12
    left_eye_x = center_x - stone_width//4
    right_eye_x = center_x + stone_width//4
    eye_y = center_y - stone_height//4
    
    # Ojo izquierdo (apenas visible)
    draw.ellipse((left_eye_x - eye_size//2, eye_y - eye_size//2,
                  left_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=DARK_STONE, outline=None)
    
    # Ojo derecho (apenas visible)
    draw.ellipse((right_eye_x - eye_size//2, eye_y - eye_size//2,
                  right_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=DARK_STONE, outline=None)
    
    # Cuernos reducidos
    horn_length = stone_width // 8
    horn_width = horn_length // 2
    
    # Cuerno izquierdo
    draw.polygon([
        (center_x - stone_width//4, center_y - stone_height//2),  # Base
        (center_x - stone_width//4 - horn_length, center_y - stone_height//2 - horn_length),  # Punta
        (center_x - stone_width//4 + horn_width, center_y - stone_height//2)  # Base derecha
    ], fill=DARK_STONE, outline=None)
    
    # Cuerno derecho
    draw.polygon([
        (center_x + stone_width//4, center_y - stone_height//2),  # Base
        (center_x + stone_width//4 + horn_length, center_y - stone_height//2 - horn_length),  # Punta
        (center_x + stone_width//4 - horn_width, center_y - stone_height//2)  # Base izquierda
    ], fill=DARK_STONE, outline=None)
    
    # Grietas para dar apariencia de piedra antigua
    for i in range(3):
        start_x = center_x - stone_width//2 + i * (stone_width // 3)
        start_y = center_y + stone_height//2
        end_x = start_x + stone_width//6
        end_y = center_y - stone_height//4
        draw.line([(start_x, start_y), (end_x, end_y)], fill=DARK_STONE, width=1)
    
    return img

def draw_gargoyle_swooping(img):
    """Dibuja una gárgola en posición de ataque en picada"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Centro de la imagen
    center_x = width // 2
    center_y = height // 2
    
    # Cuerpo principal (inclinado para el ataque)
    body_width = width // 3
    body_height = height // 3
    body_angle = 30  # Grados para inclinar el cuerpo
    
    # Dibujar cuerpo inclinado
    draw.ellipse((center_x - body_width//2, center_y - body_height//2, 
                  center_x + body_width//2, center_y + body_height//2), 
                 fill=STONE_COLOR, outline=DARK_STONE)
    
    # Cabeza (más pequeña que el cuerpo, inclinada hacia abajo)
    head_size = body_width // 2
    head_y = center_y - body_height//4
    head_x = center_x + body_width//4  # Desplazada hacia adelante
    
    draw.ellipse((head_x - head_size//2, head_y - head_size//2,
                  head_x + head_size//2, head_y + head_size//2),
                 fill=STONE_COLOR, outline=DARK_STONE)
    
    # Ojos (rojos e intensos durante el ataque)
    eye_size = head_size // 4
    left_eye_x = head_x - head_size//4
    right_eye_x = head_x + head_size//4
    eye_y = head_y - eye_size//2
    
    # Ojo izquierdo
    draw.ellipse((left_eye_x - eye_size//2, eye_y - eye_size//2,
                  left_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=EYE_COLOR, outline=DARK_STONE)
    
    # Ojo derecho
    draw.ellipse((right_eye_x - eye_size//2, eye_y - eye_size//2,
                  right_eye_x + eye_size//2, eye_y + eye_size//2),
                 fill=EYE_COLOR, outline=DARK_STONE)
    
    # Cuernos (apuntando hacia adelante)
    horn_length = head_size // 1.2
    horn_width = horn_length // 3
    
    # Cuerno izquierdo
    draw.polygon([
        (head_x - head_size//3, head_y - head_size//3),  # Base
        (head_x + horn_length, head_y - head_size//2),   # Punta
        (head_x - head_size//3, head_y)                  # Base inferior
    ], fill=STONE_COLOR, outline=DARK_STONE)
    
    # Cuerno derecho
    draw.polygon([
        (head_x + head_size//3, head_y - head_size//3),  # Base
        (head_x + horn_length, head_y - head_size//2),   # Punta
        (head_x + head_size//3, head_y)                  # Base inferior
    ], fill=STONE_COLOR, outline=DARK_STONE)
    
    # Alas extendidas para atacar
    wing_width = width // 1.8
    wing_height = height // 2.5
    
    # Ala izquierda (extendida para ataque)
    left_wing_x = center_x - body_width//3
    left_wing_y = center_y
    draw.polygon([
        (left_wing_x, left_wing_y),                             # Punto de conexión con el cuerpo
        (left_wing_x - wing_width//2, left_wing_y - wing_height//1.2),  # Punta superior
        (left_wing_x - wing_width, left_wing_y),                # Punta lateral
        (left_wing_x - wing_width//2, left_wing_y + wing_height//2)    # Punta inferior
    ], fill=WING_COLOR, outline=DARK_STONE)
    
    # Detalle de ala izquierda (costillas)
    for i in range(1, 5):
        factor = i / 5
        draw.line(
            [(left_wing_x, left_wing_y),
             (left_wing_x - wing_width * factor, left_wing_y)],
            fill=DARK_STONE, width=2
        )
    
    # Ala derecha (extendida para ataque)
    right_wing_x = center_x + body_width//3
    right_wing_y = center_y
    draw.polygon([
        (right_wing_x, right_wing_y),                             # Punto de conexión con el cuerpo
        (right_wing_x + wing_width//2, right_wing_y - wing_height//1.2),  # Punta superior
        (right_wing_x + wing_width, right_wing_y),                # Punta lateral
        (right_wing_x + wing_width//2, right_wing_y + wing_height//2)    # Punta inferior
    ], fill=WING_COLOR, outline=DARK_STONE)
    
    # Detalle de ala derecha (costillas)
    for i in range(1, 5):
        factor = i / 5
        draw.line(
            [(right_wing_x, right_wing_y),
             (right_wing_x + wing_width * factor, right_wing_y)],
            fill=DARK_STONE, width=2
        )
    
    # Garras extendidas para atacar
    # Patas traseras
    leg_length = body_height // 1.5
    leg_width = leg_length // 3
    
    # Pata izquierda
    left_leg_x = center_x - body_width//3
    left_leg_y = center_y + body_height//2
    draw.line(
        [(left_leg_x, left_leg_y), (left_leg_x, left_leg_y + leg_length)],
        fill=STONE_COLOR, width=int(leg_width)
    )
    
    # Garras izquierdas
    for i in range(3):
        claw_length = leg_width
        start_x = left_leg_x - leg_width//2 + i * leg_width//2
        start_y = left_leg_y + leg_length
        end_x = start_x - claw_length//2
        end_y = start_y + claw_length
        draw.line([(start_x, start_y), (end_x, end_y)], fill=STONE_COLOR, width=2)
    
    # Pata derecha
    right_leg_x = center_x + body_width//3
    right_leg_y = center_y + body_height//2
    draw.line(
        [(right_leg_x, right_leg_y), (right_leg_x, right_leg_y + leg_length)],
        fill=STONE_COLOR, width=int(leg_width)
    )
    
    # Garras derechas
    for i in range(3):
        claw_length = leg_width
        start_x = right_leg_x - leg_width//2 + i * leg_width//2
        start_y = right_leg_y + leg_length
        end_x = start_x + claw_length//2
        end_y = start_y + claw_length
        draw.line([(start_x, start_y), (end_x, end_y)], fill=STONE_COLOR, width=2)
    
    # Brazos en posición de ataque
    arm_length = body_height * 0.8
    arm_width = leg_width // 1.2
    
    # Brazo izquierdo extendido
    left_arm_x = center_x - body_width//3
    left_arm_y = center_y 
    draw.line(
        [(left_arm_x, left_arm_y), (left_arm_x - arm_length//2, left_arm_y + arm_length)],
        fill=STONE_COLOR, width=int(arm_width)
    )
    
    # Garras izquierdas extendidas
    for i in range(3):
        claw_length = arm_width * 1.5
        start_x = left_arm_x - arm_length//2
        start_y = left_arm_y + arm_length
        end_x = start_x - claw_length
        end_y = start_y + (i - 1) * claw_length//2
        draw.line([(start_x, start_y), (end_x, end_y)], fill=STONE_COLOR, width=3)
    
    # Brazo derecho extendido
    right_arm_x = center_x + body_width//3
    right_arm_y = center_y
    draw.line(
        [(right_arm_x, right_arm_y), (right_arm_x + arm_length//2, right_arm_y + arm_length)],
        fill=STONE_COLOR, width=int(arm_width)
    )
    
    # Garras derechas extendidas
    for i in range(3):
        claw_length = arm_width * 1.5
        start_x = right_arm_x + arm_length//2
        start_y = right_arm_y + arm_length
        end_x = start_x + claw_length
        end_y = start_y + (i - 1) * claw_length//2
        draw.line([(start_x, start_y), (end_x, end_y)], fill=STONE_COLOR, width=3)
    
    return img

def create_all_sprites():
    """Crear todos los sprites de la gárgola"""
    width, height = 128, 128
    
    # Sprite 1: Gárgola en posición normal
    gargoyle_standing = create_base_image(width, height)
    gargoyle_standing = draw_gargoyle_standing(gargoyle_standing)
    gargoyle_standing.save(f'{output_dir}/gargoyle_standing.png')
    
    # Sprite 2: Gárgola en forma de piedra (defensiva)
    gargoyle_stone = create_base_image(width, height)
    gargoyle_stone = draw_gargoyle_stone(gargoyle_stone)
    gargoyle_stone.save(f'{output_dir}/gargoyle_stone.png')
    
    # Sprite 3: Gárgola en ataque
    gargoyle_swooping = create_base_image(width, height)
    gargoyle_swooping = draw_gargoyle_swooping(gargoyle_swooping)
    gargoyle_swooping.save(f'{output_dir}/gargoyle_swooping.png')
    
    print(f"Sprites de Gárgola creados en {output_dir}:")
    print("- gargoyle_standing.png")
    print("- gargoyle_stone.png")
    print("- gargoyle_swooping.png")

if __name__ == "__main__":
    create_all_sprites() 