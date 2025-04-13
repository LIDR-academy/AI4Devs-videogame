from PIL import Image, ImageDraw
import os

# Colores para Arthur sin armadura
SKIN_COLOR = (255, 213, 170)
BEARD_COLOR = (139, 69, 19)
UNDERWEAR_COLOR = (255, 255, 255)
BOOTS_COLOR = (139, 69, 19)

# Crear directorio para los sprites si no existe
os.makedirs("ghosts-n-goblins/assets/images/Arthur/Underwear", exist_ok=True)

def create_sprite_sheet(filename, width, height, frames, draw_func):
    # Crear imagen nueva con el ancho suficiente para todos los frames
    img = Image.new("RGBA", (width * frames, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dibujar cada frame
    for i in range(frames):
        draw_func(draw, i * width, 0, i)
    
    # Guardar la imagen
    sprite_dir = "ghosts-n-goblins/assets/images/Arthur/Underwear"
    img.save(os.path.join(sprite_dir, filename))
    
    return img

def draw_idle_underwear(draw, x, y, frame):
    # Variable para alternar efectos de "respiración"
    breath_offset = 1 if frame % 2 == 0 else 0
    
    # Cabeza: pelo
    draw.ellipse([x+15, y+6, x+25, y+16], fill=BEARD_COLOR)
    
    # Cara
    draw.rectangle([x+14, y+16, x+26, y+28], fill=SKIN_COLOR)
    
    # Barba
    draw.ellipse([x+14, y+22, x+26, y+34], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+22, x+26, y+28], fill=SKIN_COLOR)  # Ajustar cara sobre barba
    
    # Ojos
    eye_open = frame % 4 != 3  # Parpadeo en el cuarto frame
    if eye_open:
        draw.rectangle([x+16, y+20, x+18, y+22], fill=(0, 0, 0))
        draw.rectangle([x+22, y+20, x+24, y+22], fill=(0, 0, 0))
    else:
        draw.line([x+16, y+20, x+18, y+20], fill=(0, 0, 0))
        draw.line([x+22, y+20, x+24, y+20], fill=(0, 0, 0))
    
    # Cuerpo con ropa interior (rectángulo blanco)
    draw.rectangle([x+14, y+28, x+26, y+38], fill=UNDERWEAR_COLOR, outline=(200, 200, 200))
    
    # Piernas
    draw.rectangle([x+16, y+38, x+20, y+44], fill=SKIN_COLOR)
    draw.rectangle([x+20, y+38, x+24, y+44], fill=SKIN_COLOR)
    
    # Botas (igual que con armadura)
    draw.rectangle([x+15, y+44, x+21, y+48], fill=BOOTS_COLOR)
    draw.rectangle([x+19, y+44, x+25, y+48], fill=BOOTS_COLOR)
    
    # Brazos
    draw.rectangle([x+10, y+28, x+14, y+36], fill=SKIN_COLOR)
    draw.rectangle([x+26, y+28, x+30, y+36], fill=SKIN_COLOR)
    
    # Manos
    draw.ellipse([x+8, y+34, x+14, y+40], fill=SKIN_COLOR)
    draw.ellipse([x+26, y+34, x+32, y+40], fill=SKIN_COLOR)

def draw_run_underwear(draw, x, y, frame):
    # Cara y cabeza (similar a idle)
    draw.ellipse([x+15, y+6, x+25, y+16], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+16, x+26, y+28], fill=SKIN_COLOR)
    draw.ellipse([x+14, y+22, x+26, y+34], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+22, x+26, y+28], fill=SKIN_COLOR)
    
    # Ojos
    draw.rectangle([x+16, y+20, x+18, y+22], fill=(0, 0, 0))
    draw.rectangle([x+22, y+20, x+24, y+22], fill=(0, 0, 0))
    
    # Cuerpo en ropa interior
    draw.rectangle([x+14, y+28, x+26, y+38], fill=UNDERWEAR_COLOR, outline=(200, 200, 200))
    
    # Piernas en movimiento de carrera
    leg_offset = 3 if frame % 2 == 0 else 0
    draw.rectangle([x+16-leg_offset, y+38, x+20-leg_offset, y+44], fill=SKIN_COLOR)
    draw.rectangle([x+20+leg_offset, y+38, x+24+leg_offset, y+44], fill=SKIN_COLOR)
    
    # Botas
    draw.rectangle([x+15-leg_offset, y+44, x+21-leg_offset, y+48], fill=BOOTS_COLOR)
    draw.rectangle([x+19+leg_offset, y+44, x+25+leg_offset, y+48], fill=BOOTS_COLOR)
    
    # Brazos en movimiento
    arm_offset = 2 if frame % 2 == 0 else -2
    draw.rectangle([x+10, y+28+arm_offset, x+14, y+36+arm_offset], fill=SKIN_COLOR)
    draw.rectangle([x+26, y+28-arm_offset, x+30, y+36-arm_offset], fill=SKIN_COLOR)
    
    # Manos
    draw.ellipse([x+8, y+34+arm_offset, x+14, y+40+arm_offset], fill=SKIN_COLOR)
    draw.ellipse([x+26, y+34-arm_offset, x+32, y+40-arm_offset], fill=SKIN_COLOR)

def draw_jump_underwear(draw, x, y, frame):
    # Base similar al idle pero elevado
    y_offset = -6  # Elevar el personaje
    
    # Cabeza y cara
    draw.ellipse([x+15, y+6+y_offset, x+25, y+16+y_offset], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+16+y_offset, x+26, y+28+y_offset], fill=SKIN_COLOR)
    draw.ellipse([x+14, y+22+y_offset, x+26, y+34+y_offset], fill=BEARD_COLOR)
    draw.rectangle([x+14, y+22+y_offset, x+26, y+28+y_offset], fill=SKIN_COLOR)
    
    # Ojos
    draw.rectangle([x+16, y+20+y_offset, x+18, y+22+y_offset], fill=(0, 0, 0))
    draw.rectangle([x+22, y+20+y_offset, x+24, y+22+y_offset], fill=(0, 0, 0))
    
    # Cuerpo en ropa interior
    draw.rectangle([x+14, y+28+y_offset, x+26, y+38+y_offset], fill=UNDERWEAR_COLOR, outline=(200, 200, 200))
    
    # Piernas en posición de salto
    draw.rectangle([x+14, y+38+y_offset, x+18, y+44+y_offset], fill=SKIN_COLOR)
    draw.rectangle([x+22, y+38+y_offset, x+26, y+44+y_offset], fill=SKIN_COLOR)
    
    # Piernas extendidas para salto
    if frame % 2 == 0:
        # Extender piernas
        draw.rectangle([x+12, y+44+y_offset, x+16, y+50+y_offset], fill=SKIN_COLOR)
        draw.rectangle([x+24, y+44+y_offset, x+28, y+50+y_offset], fill=SKIN_COLOR)
    else:
        # Piernas recogidas
        draw.rectangle([x+16, y+44+y_offset, x+20, y+48+y_offset], fill=SKIN_COLOR)
        draw.rectangle([x+20, y+44+y_offset, x+24, y+48+y_offset], fill=SKIN_COLOR)
    
    # Botas
    if frame % 2 == 0:
        draw.rectangle([x+11, y+48+y_offset, x+17, y+52+y_offset], fill=BOOTS_COLOR)
        draw.rectangle([x+23, y+48+y_offset, x+29, y+52+y_offset], fill=BOOTS_COLOR)
    else:
        draw.rectangle([x+15, y+46+y_offset, x+21, y+50+y_offset], fill=BOOTS_COLOR)
        draw.rectangle([x+19, y+46+y_offset, x+25, y+50+y_offset], fill=BOOTS_COLOR)
    
    # Brazos en posición de salto
    draw.rectangle([x+10, y+28+y_offset, x+14, y+34+y_offset], fill=SKIN_COLOR)
    draw.rectangle([x+26, y+28+y_offset, x+30, y+34+y_offset], fill=SKIN_COLOR)
    
    # Manos hacia arriba
    draw.ellipse([x+9, y+26+y_offset, x+15, y+32+y_offset], fill=SKIN_COLOR)
    draw.ellipse([x+25, y+26+y_offset, x+31, y+32+y_offset], fill=SKIN_COLOR)

def draw_throw_underwear(draw, x, y, frame):
    # Secuencia de frames para lanzamiento
    if frame == 0:
        # Posición inicial (similar a idle)
        draw_idle_underwear(draw, x, y, 0)
    elif frame == 1 or frame == 2:
        # Posición de lanzamiento con brazo extendido
        
        # Cabeza y cara
        draw.ellipse([x+15, y+6, x+25, y+16], fill=BEARD_COLOR)
        draw.rectangle([x+14, y+16, x+26, y+28], fill=SKIN_COLOR)
        draw.ellipse([x+14, y+22, x+26, y+34], fill=BEARD_COLOR)
        draw.rectangle([x+14, y+22, x+26, y+28], fill=SKIN_COLOR)
        
        # Ojos
        draw.rectangle([x+16, y+20, x+18, y+22], fill=(0, 0, 0))
        draw.rectangle([x+22, y+20, x+24, y+22], fill=(0, 0, 0))
        
        # Cuerpo en ropa interior
        draw.rectangle([x+14, y+28, x+26, y+38], fill=UNDERWEAR_COLOR, outline=(200, 200, 200))
        
        # Piernas
        draw.rectangle([x+16, y+38, x+20, y+44], fill=SKIN_COLOR)
        draw.rectangle([x+20, y+38, x+24, y+44], fill=SKIN_COLOR)
        
        # Botas
        draw.rectangle([x+15, y+44, x+21, y+48], fill=BOOTS_COLOR)
        draw.rectangle([x+19, y+44, x+25, y+48], fill=BOOTS_COLOR)
        
        # Brazo trasero
        draw.rectangle([x+10, y+28, x+14, y+36], fill=SKIN_COLOR)
        draw.ellipse([x+8, y+34, x+14, y+40], fill=SKIN_COLOR)
        
        # Brazo lanzando extendido
        extended_arm_x = 36 if frame == 2 else 30
        draw.rectangle([x+26, y+28, x+extended_arm_x, y+32], fill=SKIN_COLOR)
        draw.ellipse([x+extended_arm_x-4, y+28, x+extended_arm_x+2, y+34], fill=SKIN_COLOR)
        
    elif frame == 3:
        # Volver a posición normal
        draw_idle_underwear(draw, x, y, 1)

# Crear los sprites
idle_img = create_sprite_sheet("Idle.png", 40, 52, 4, draw_idle_underwear)
run_img = create_sprite_sheet("Run.png", 40, 52, 4, draw_run_underwear)
jump_img = create_sprite_sheet("Jump.png", 40, 52, 4, draw_jump_underwear)
throw_img = create_sprite_sheet("Throw.png", 40, 52, 4, draw_throw_underwear)

print("Todas las imágenes de Arthur sin armadura han sido creadas en: ghosts-n-goblins/assets/images/Arthur/Underwear") 