from PIL import Image, ImageDraw
import os

# Asegurar que el directorio existe
sprite_dir = 'ghosts-n-goblins/assets/images/Arthur'
os.makedirs(sprite_dir, exist_ok=True)

# Colores
ARMOR_COLOR = (150, 150, 150)  # Gris para la armadura
SKIN_COLOR = (235, 181, 156)   # Color de piel
HAIR_COLOR = (139, 69, 19)     # Cabello y barba marrón
BEARD_COLOR = (160, 82, 45)    # Barba más rojiza
WEAPON_COLOR = (192, 192, 192) # Plateado para el arma
HELMET_COLOR = (150, 150, 180) # Plateado azulado para el casco
BOOTS_COLOR = (101, 67, 33)    # Botas marrones
RED_COLOR = (200, 50, 50)      # Rojo para detalles

# Función para crear un sprite con varias imágenes (frames)
def create_sprite_sheet(filename, width, height, num_frames, draw_function):
    # Crear una imagen con varios frames horizontales
    img = Image.new('RGBA', (width * num_frames, height), color=(0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for frame in range(num_frames):
        draw_function(draw, frame * width, 0, frame)
    
    # Guardar la imagen
    img.save(os.path.join(sprite_dir, filename))
    print(f"Sprite creado: {filename}")
    return img

# Funciones para dibujar cada pose
def draw_idle(draw, x, y, frame):
    # Tamaño del enano: algo más pequeño que una persona normal
    frame_offset = frame * 4  # Pequeña variación entre frames
    
    # Casco
    draw.ellipse([x+12, y+6, x+28, y+22], fill=HELMET_COLOR, outline=(100, 100, 130))
    
    # Cara
    draw.rectangle([x+14, y+16, x+26, y+28], fill=SKIN_COLOR)
    
    # Barba
    draw.ellipse([x+14, y+22, x+26, y+34], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+22, x+26, y+28], fill=SKIN_COLOR)  # Ajustar cara sobre barba
    
    # Ojos
    draw.rectangle([x+16, y+20, x+18, y+22], fill=(0, 0, 0))
    draw.rectangle([x+22, y+20, x+24, y+22], fill=(0, 0, 0))
    
    # Cuerpo/Armadura
    draw.rectangle([x+14, y+28, x+26, y+38], fill=ARMOR_COLOR, outline=(100, 100, 100))
    
    # Piernas
    draw.rectangle([x+14, y+38, x+18, y+48], fill=ARMOR_COLOR)
    draw.rectangle([x+22, y+38, x+26, y+48], fill=ARMOR_COLOR)
    
    # Botas
    draw.rectangle([x+13, y+46, x+19, y+50], fill=BOOTS_COLOR)
    draw.rectangle([x+21, y+46, x+27, y+50], fill=BOOTS_COLOR)
    
    # Brazos
    arm_offset = 2 if frame % 2 == 0 else 0  # Mover brazos ligeramente en frames alternos
    draw.rectangle([x+10-arm_offset, y+28, x+14-arm_offset, y+36], fill=ARMOR_COLOR)
    draw.rectangle([x+26+arm_offset, y+28, x+30+arm_offset, y+36], fill=ARMOR_COLOR)
    
    # Manos
    draw.ellipse([x+8-arm_offset, y+34, x+14-arm_offset, y+40], fill=SKIN_COLOR)
    draw.ellipse([x+26+arm_offset, y+34, x+32+arm_offset, y+40], fill=SKIN_COLOR)
    
    # Detalles de la armadura
    draw.line([x+14, y+32, x+26, y+32], fill=RED_COLOR, width=2)

def draw_run(draw, x, y, frame):
    # Base similar al idle
    draw_idle(draw, x, y, frame)
    
    # Ajustar posición de las piernas para correr
    if frame % 4 == 0:
        # Pierna izquierda adelante, derecha atrás
        draw.rectangle([x+14, y+38, x+18, y+46], fill=(0, 0, 0, 0))  # Borrar pierna izquierda
        draw.rectangle([x+22, y+38, x+26, y+48], fill=(0, 0, 0, 0))  # Borrar pierna derecha
        
        # Redibujar piernas en nueva posición
        draw.rectangle([x+18, y+38, x+22, y+48], fill=ARMOR_COLOR)  # Pierna izquierda adelante
        draw.rectangle([x+12, y+38, x+16, y+44], fill=ARMOR_COLOR)  # Pierna derecha atrás
        
        # Botas
        draw.rectangle([x+17, y+46, x+23, y+50], fill=BOOTS_COLOR)  # Bota izquierda
        draw.rectangle([x+11, y+42, x+17, y+46], fill=BOOTS_COLOR)  # Bota derecha
    elif frame % 4 == 1 or frame % 4 == 3:
        # Ambas piernas en posición media
        draw.rectangle([x+14, y+38, x+18, y+48], fill=ARMOR_COLOR)
        draw.rectangle([x+22, y+38, x+26, y+48], fill=ARMOR_COLOR)
        
        # Botas
        draw.rectangle([x+13, y+46, x+19, y+50], fill=BOOTS_COLOR)
        draw.rectangle([x+21, y+46, x+27, y+50], fill=BOOTS_COLOR)
    else:  # frame % 4 == 2
        # Pierna derecha adelante, izquierda atrás
        draw.rectangle([x+14, y+38, x+18, y+48], fill=(0, 0, 0, 0))  # Borrar pierna izquierda
        draw.rectangle([x+22, y+38, x+26, y+48], fill=(0, 0, 0, 0))  # Borrar pierna derecha
        
        # Redibujar piernas en nueva posición
        draw.rectangle([x+18, y+38, x+22, y+44], fill=ARMOR_COLOR)  # Pierna izquierda atrás
        draw.rectangle([x+24, y+38, x+28, y+48], fill=ARMOR_COLOR)  # Pierna derecha adelante
        
        # Botas
        draw.rectangle([x+17, y+42, x+23, y+46], fill=BOOTS_COLOR)  # Bota izquierda
        draw.rectangle([x+23, y+46, x+29, y+50], fill=BOOTS_COLOR)  # Bota derecha
    
    # Brazos en posición de correr
    arm_offset = 4 if frame % 2 == 0 else -4  # Mover brazos alternadamente
    draw.rectangle([x+10-arm_offset, y+28, x+14-arm_offset, y+36], fill=ARMOR_COLOR)
    draw.rectangle([x+26+arm_offset, y+28, x+30+arm_offset, y+36], fill=ARMOR_COLOR)
    
    # Manos
    draw.ellipse([x+8-arm_offset, y+34, x+14-arm_offset, y+40], fill=SKIN_COLOR)
    draw.ellipse([x+26+arm_offset, y+34, x+32+arm_offset, y+40], fill=SKIN_COLOR)

def draw_jump(draw, x, y, frame):
    # Base similar al idle pero elevado
    y_offset = -6  # Elevar el personaje
    
    # Casco
    draw.ellipse([x+12, y+6+y_offset, x+28, y+22+y_offset], fill=HELMET_COLOR, outline=(100, 100, 130))
    
    # Cara
    draw.rectangle([x+14, y+16+y_offset, x+26, y+28+y_offset], fill=SKIN_COLOR)
    
    # Barba
    draw.ellipse([x+14, y+22+y_offset, x+26, y+34+y_offset], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+22+y_offset, x+26, y+28+y_offset], fill=SKIN_COLOR)  # Ajustar cara sobre barba
    
    # Ojos
    draw.rectangle([x+16, y+20+y_offset, x+18, y+22+y_offset], fill=(0, 0, 0))
    draw.rectangle([x+22, y+20+y_offset, x+24, y+22+y_offset], fill=(0, 0, 0))
    
    # Cuerpo/Armadura
    draw.rectangle([x+14, y+28+y_offset, x+26, y+38+y_offset], fill=ARMOR_COLOR, outline=(100, 100, 100))
    
    # Piernas en posición de salto
    draw.rectangle([x+14, y+38+y_offset, x+18, y+44+y_offset], fill=ARMOR_COLOR)
    draw.rectangle([x+22, y+38+y_offset, x+26, y+44+y_offset], fill=ARMOR_COLOR)
    
    # Piernas extendidas para salto
    if frame % 2 == 0:
        # Extender piernas
        draw.rectangle([x+12, y+44+y_offset, x+16, y+50+y_offset], fill=ARMOR_COLOR)
        draw.rectangle([x+24, y+44+y_offset, x+28, y+50+y_offset], fill=ARMOR_COLOR)
    else:
        # Piernas recogidas
        draw.rectangle([x+16, y+44+y_offset, x+20, y+48+y_offset], fill=ARMOR_COLOR)
        draw.rectangle([x+20, y+44+y_offset, x+24, y+48+y_offset], fill=ARMOR_COLOR)
    
    # Botas
    if frame % 2 == 0:
        draw.rectangle([x+11, y+48+y_offset, x+17, y+52+y_offset], fill=BOOTS_COLOR)
        draw.rectangle([x+23, y+48+y_offset, x+29, y+52+y_offset], fill=BOOTS_COLOR)
    else:
        draw.rectangle([x+15, y+46+y_offset, x+21, y+50+y_offset], fill=BOOTS_COLOR)
        draw.rectangle([x+19, y+46+y_offset, x+25, y+50+y_offset], fill=BOOTS_COLOR)
    
    # Brazos en posición de salto
    draw.rectangle([x+10, y+28+y_offset, x+14, y+34+y_offset], fill=ARMOR_COLOR)
    draw.rectangle([x+26, y+28+y_offset, x+30, y+34+y_offset], fill=ARMOR_COLOR)
    
    # Manos extendidas hacia arriba
    draw.ellipse([x+9, y+26+y_offset, x+15, y+32+y_offset], fill=SKIN_COLOR)
    draw.ellipse([x+25, y+26+y_offset, x+31, y+32+y_offset], fill=SKIN_COLOR)

def draw_throw(draw, x, y, frame):
    # Base similar al idle
    draw_idle(draw, x, y, frame)
    
    # Modificar el brazo derecho para lanzar
    if frame % 4 == 0:
        # Inicio: como idle
        pass
    elif frame % 4 == 1:
        # Preparación: brazo hacia atrás
        draw.rectangle([x+26, y+28, x+34, y+32], fill=ARMOR_COLOR)
        draw.ellipse([x+32, y+28, x+38, y+34], fill=SKIN_COLOR)
    elif frame % 4 == 2:
        # Lanzamiento: brazo extendido
        draw.rectangle([x+26, y+28, x+36, y+32], fill=ARMOR_COLOR)
        draw.ellipse([x+34, y+28, x+40, y+34], fill=SKIN_COLOR)
        
        # Dibujar el arma/hacha
        draw.rectangle([x+38, y+26, x+46, y+30], fill=WEAPON_COLOR)
        draw.polygon([x+46, y+24, x+50, y+28, x+46, y+32], fill=WEAPON_COLOR)
    else:  # frame % 4 == 3
        # Finalización: regreso del brazo
        draw.rectangle([x+26, y+28, x+32, y+34], fill=ARMOR_COLOR)
        draw.ellipse([x+30, y+32, x+36, y+38], fill=SKIN_COLOR)

def draw_death(draw, x, y, frame):
    if frame == 0:
        # Pose inicial, similar al idle pero con expresión de sorpresa
        draw_idle(draw, x, y, frame)
        
        # Cambiar ojos a expresión de sorpresa
        draw.rectangle([x+16, y+20, x+18, y+23], fill=(0, 0, 0))  # Ojo izquierdo más grande
        draw.rectangle([x+22, y+20, x+24, y+23], fill=(0, 0, 0))  # Ojo derecho más grande
    
    elif frame == 1:
        # Inclinación hacia atrás
        
        # Casco
        draw.ellipse([x+12, y+2, x+28, y+18], fill=HELMET_COLOR, outline=(100, 100, 130))
        
        # Cara
        draw.rectangle([x+14, y+12, x+26, y+24], fill=SKIN_COLOR)
        
        # Barba
        draw.ellipse([x+14, y+18, x+26, y+30], fill=BEARD_COLOR)
        draw.rectangle([x+14, y+18, x+26, y+24], fill=SKIN_COLOR)  # Ajustar cara sobre barba
        
        # Ojos (X para indicar muerte)
        draw.line([x+16, y+18, x+19, y+21], fill=(0, 0, 0), width=1)
        draw.line([x+19, y+18, x+16, y+21], fill=(0, 0, 0), width=1)
        draw.line([x+22, y+18, x+25, y+21], fill=(0, 0, 0), width=1)
        draw.line([x+25, y+18, x+22, y+21], fill=(0, 0, 0), width=1)
        
        # Cuerpo/Armadura inclinado hacia atrás
        draw.rectangle([x+14, y+24, x+26, y+34], fill=ARMOR_COLOR, outline=(100, 100, 100))
        
        # Piernas dobladas
        draw.rectangle([x+12, y+34, x+16, y+44], fill=ARMOR_COLOR)
        draw.rectangle([x+20, y+34, x+24, y+44], fill=ARMOR_COLOR)
        
        # Botas
        draw.rectangle([x+11, y+42, x+17, y+46], fill=BOOTS_COLOR)
        draw.rectangle([x+19, y+42, x+25, y+46], fill=BOOTS_COLOR)
        
        # Brazos caídos
        draw.rectangle([x+8, y+28, x+12, y+36], fill=ARMOR_COLOR)
        draw.rectangle([x+28, y+28, x+32, y+36], fill=ARMOR_COLOR)
        
        # Manos
        draw.ellipse([x+6, y+34, x+12, y+40], fill=SKIN_COLOR)
        draw.ellipse([x+30, y+34, x+36, y+40], fill=SKIN_COLOR)
    
    elif frame == 2:
        # Cayendo al suelo
        
        # Casco
        draw.ellipse([x+12, y+18, x+28, y+34], fill=HELMET_COLOR, outline=(100, 100, 130))
        
        # Cara (apenas visible)
        draw.rectangle([x+14, y+28, x+26, y+34], fill=SKIN_COLOR)
        
        # Barba
        draw.ellipse([x+14, y+30, x+26, y+40], fill=BEARD_COLOR)
        
        # Cuerpo/Armadura caído
        draw.rectangle([x+14, y+36, x+26, y+42], fill=ARMOR_COLOR, outline=(100, 100, 100))
        
        # Extremidades desparramadas
        draw.rectangle([x+8, y+36, x+14, y+40], fill=ARMOR_COLOR)  # Brazo izquierdo
        draw.rectangle([x+26, y+36, x+32, y+40], fill=ARMOR_COLOR)  # Brazo derecho
        draw.rectangle([x+14, y+42, x+18, y+48], fill=ARMOR_COLOR)  # Pierna izquierda
        draw.rectangle([x+22, y+42, x+26, y+48], fill=ARMOR_COLOR)  # Pierna derecha
        
        # Manos y botas
        draw.ellipse([x+4, y+38, x+10, y+44], fill=SKIN_COLOR)
        draw.ellipse([x+30, y+38, x+36, y+44], fill=SKIN_COLOR)
        draw.rectangle([x+13, y+46, x+19, y+50], fill=BOOTS_COLOR)
        draw.rectangle([x+21, y+46, x+27, y+50], fill=BOOTS_COLOR)
    
    else:  # frame == 3
        # Totalmente en el suelo
        
        # Cuerpo estirado
        draw.ellipse([x+12, y+34, x+28, y+42], fill=ARMOR_COLOR)  # Torso
        
        # Casco tirado
        draw.ellipse([x+6, y+34, x+16, y+44], fill=HELMET_COLOR, outline=(100, 100, 130))
        
        # Barba visible
        draw.ellipse([x+12, y+30, x+24, y+38], fill=BEARD_COLOR)
        
        # Extremidades
        draw.rectangle([x+28, y+36, x+38, y+40], fill=ARMOR_COLOR)  # Brazo derecho
        draw.rectangle([x+24, y+42, x+34, y+46], fill=ARMOR_COLOR)  # Pierna derecha
        draw.rectangle([x+18, y+42, x+28, y+46], fill=ARMOR_COLOR)  # Pierna izquierda
        
        # Mano y botas
        draw.ellipse([x+36, y+38, x+42, y+44], fill=SKIN_COLOR)
        draw.rectangle([x+32, y+44, x+38, y+48], fill=BOOTS_COLOR)
        draw.rectangle([x+16, y+44, x+22, y+48], fill=BOOTS_COLOR)

# Crear los sprites
idle_img = create_sprite_sheet("Idle.png", 40, 52, 4, draw_idle)
run_img = create_sprite_sheet("Run.png", 40, 52, 4, draw_run)
jump_img = create_sprite_sheet("Jump.png", 40, 52, 4, draw_jump)
throw_img = create_sprite_sheet("Throw.png", 40, 52, 4, draw_throw)
death_img = create_sprite_sheet("Death.png", 40, 52, 4, draw_death)

print("Todas las imágenes de Arthur han sido creadas en:", sprite_dir) 