from PIL import Image, ImageDraw
import os

# Asegurar que existe el directorio para guardar los sprites
output_dir = 'ghosts-n-goblins/assets/sprites/enemies'
os.makedirs(output_dir, exist_ok=True)

# Colores
BONE_COLOR = (220, 220, 210)
DARK_BONE = (180, 180, 170)
BG_COLOR = (0, 0, 0, 0)  # Transparente
EYE_COLOR = (0, 200, 100)  # Ojos verdes brillantes

def create_skeleton_base(width, height):
    """Crea una imagen base para el esqueleto"""
    img = Image.new('RGBA', (width, height), BG_COLOR)
    return img

def draw_skeleton_standing(img):
    """Dibuja un esqueleto en posición de pie"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Cabeza (cráneo)
    skull_x, skull_y = width // 2, height // 4
    skull_size = width // 5
    
    # Cráneo principal
    draw.ellipse((skull_x - skull_size, skull_y - skull_size, 
                  skull_x + skull_size, skull_y + skull_size), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Ojos
    eye_size = skull_size // 4
    draw.ellipse((skull_x - eye_size*2, skull_y - eye_size//2, 
                  skull_x - eye_size, skull_y + eye_size//2), fill=(0, 0, 0), outline=DARK_BONE)
    draw.ellipse((skull_x + eye_size, skull_y - eye_size//2, 
                  skull_x + eye_size*2, skull_y + eye_size//2), fill=(0, 0, 0), outline=DARK_BONE)
    
    # Brillo en los ojos
    draw.ellipse((skull_x - eye_size*2 + 2, skull_y - eye_size//2 + 2, 
                  skull_x - eye_size - 2, skull_y + eye_size//2 - 2), fill=EYE_COLOR)
    draw.ellipse((skull_x + eye_size + 2, skull_y - eye_size//2 + 2, 
                  skull_x + eye_size*2 - 2, skull_y + eye_size//2 - 2), fill=EYE_COLOR)
    
    # Mandíbula
    jaw_y = skull_y + skull_size//2
    draw.ellipse((skull_x - skull_size + 5, jaw_y, 
                  skull_x + skull_size - 5, jaw_y + skull_size//2), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Dientes
    tooth_width = skull_size // 6
    for i in range(4):
        x = skull_x - skull_size//2 + i*tooth_width + tooth_width//2
        draw.rectangle((x, jaw_y, x + tooth_width, jaw_y + tooth_width), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Torso
    torso_width = skull_size * 1.8
    torso_height = skull_size * 2.5
    torso_x = width // 2
    torso_y = skull_y + skull_size + 5
    
    # Costillas
    rib_height = torso_height // 5
    for i in range(4):
        rib_y = torso_y + i * rib_height
        # Línea central
        draw.line([(torso_x, rib_y), (torso_x, rib_y + rib_height)], fill=BONE_COLOR, width=4)
        # Costillas horizontales
        draw.line([(torso_x - torso_width//2, rib_y), (torso_x + torso_width//2, rib_y)], fill=BONE_COLOR, width=3)
    
    # Pelvis
    pelvis_y = torso_y + torso_height
    draw.arc((torso_x - torso_width//2, pelvis_y - torso_width//3, 
              torso_x + torso_width//2, pelvis_y + torso_width//3), 0, 180, fill=BONE_COLOR, width=4)
    
    # Brazos
    arm_length = torso_height * 0.8
    
    # Brazo izquierdo
    left_shoulder_x = torso_x - torso_width//2
    left_shoulder_y = torso_y + rib_height//2
    left_elbow_x = left_shoulder_x - torso_width//4
    left_elbow_y = left_shoulder_y + arm_length//2
    left_hand_x = left_elbow_x - torso_width//8
    left_hand_y = left_elbow_y + arm_length//2
    
    # Húmero
    draw.line([(left_shoulder_x, left_shoulder_y), (left_elbow_x, left_elbow_y)], fill=BONE_COLOR, width=4)
    # Radio/Cúbito
    draw.line([(left_elbow_x, left_elbow_y), (left_hand_x, left_hand_y)], fill=BONE_COLOR, width=3)
    
    # Mano izquierda
    finger_length = arm_length // 6
    for i in range(3):
        finger_start_x = left_hand_x
        finger_start_y = left_hand_y
        finger_end_x = finger_start_x - finger_length*0.7
        finger_end_y = finger_start_y - finger_length + i*finger_length//2
        draw.line([(finger_start_x, finger_start_y), (finger_end_x, finger_end_y)], fill=BONE_COLOR, width=2)
    
    # Brazo derecho (sosteniendo hueso para lanzar)
    right_shoulder_x = torso_x + torso_width//2
    right_shoulder_y = torso_y + rib_height//2
    right_elbow_x = right_shoulder_x + torso_width//4
    right_elbow_y = right_shoulder_y + arm_length//2
    right_hand_x = right_elbow_x + torso_width//6
    right_hand_y = right_elbow_y - arm_length//4
    
    # Húmero
    draw.line([(right_shoulder_x, right_shoulder_y), (right_elbow_x, right_elbow_y)], fill=BONE_COLOR, width=4)
    # Radio/Cúbito
    draw.line([(right_elbow_x, right_elbow_y), (right_hand_x, right_hand_y)], fill=BONE_COLOR, width=3)
    
    # Hueso para lanzar
    bone_length = arm_length // 2
    draw.line([(right_hand_x, right_hand_y), (right_hand_x + bone_length, right_hand_y)], fill=BONE_COLOR, width=4)
    draw.ellipse((right_hand_x + bone_length - 5, right_hand_y - 5, 
                  right_hand_x + bone_length + 5, right_hand_y + 5), fill=BONE_COLOR, outline=DARK_BONE)
    draw.ellipse((right_hand_x - 5, right_hand_y - 5, 
                  right_hand_x + 5, right_hand_y + 5), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Piernas
    leg_length = torso_height * 0.9
    
    # Pierna izquierda
    left_hip_x = torso_x - torso_width//4
    left_hip_y = pelvis_y
    left_knee_x = left_hip_x
    left_knee_y = left_hip_y + leg_length//2
    left_foot_x = left_knee_x - torso_width//6
    left_foot_y = left_knee_y + leg_length//2
    
    # Fémur
    draw.line([(left_hip_x, left_hip_y), (left_knee_x, left_knee_y)], fill=BONE_COLOR, width=4)
    # Tibia/Peroné
    draw.line([(left_knee_x, left_knee_y), (left_foot_x, left_foot_y)], fill=BONE_COLOR, width=3)
    
    # Pie izquierdo
    draw.line([(left_foot_x, left_foot_y), (left_foot_x - torso_width//8, left_foot_y)], fill=BONE_COLOR, width=3)
    
    # Pierna derecha
    right_hip_x = torso_x + torso_width//4
    right_hip_y = pelvis_y
    right_knee_x = right_hip_x
    right_knee_y = right_hip_y + leg_length//2
    right_foot_x = right_knee_x + torso_width//6
    right_foot_y = right_knee_y + leg_length//2
    
    # Fémur
    draw.line([(right_hip_x, right_hip_y), (right_knee_x, right_knee_y)], fill=BONE_COLOR, width=4)
    # Tibia/Peroné
    draw.line([(right_knee_x, right_knee_y), (right_foot_x, right_foot_y)], fill=BONE_COLOR, width=3)
    
    # Pie derecho
    draw.line([(right_foot_x, right_foot_y), (right_foot_x + torso_width//8, right_foot_y)], fill=BONE_COLOR, width=3)
    
    return img

def draw_skeleton_throwing(img):
    """Dibuja un esqueleto en posición de lanzamiento"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # La mayoría es igual que la pose de pie pero con el brazo derecho estirado
    
    # Cabeza (cráneo)
    skull_x, skull_y = width // 2, height // 4
    skull_size = width // 5
    
    # Cráneo principal
    draw.ellipse((skull_x - skull_size, skull_y - skull_size, 
                  skull_x + skull_size, skull_y + skull_size), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Ojos
    eye_size = skull_size // 4
    draw.ellipse((skull_x - eye_size*2, skull_y - eye_size//2, 
                  skull_x - eye_size, skull_y + eye_size//2), fill=(0, 0, 0), outline=DARK_BONE)
    draw.ellipse((skull_x + eye_size, skull_y - eye_size//2, 
                  skull_x + eye_size*2, skull_y + eye_size//2), fill=(0, 0, 0), outline=DARK_BONE)
    
    # Brillo en los ojos
    draw.ellipse((skull_x - eye_size*2 + 2, skull_y - eye_size//2 + 2, 
                  skull_x - eye_size - 2, skull_y + eye_size//2 - 2), fill=EYE_COLOR)
    draw.ellipse((skull_x + eye_size + 2, skull_y - eye_size//2 + 2, 
                  skull_x + eye_size*2 - 2, skull_y + eye_size//2 - 2), fill=EYE_COLOR)
    
    # Mandíbula (más abierta para lanzar)
    jaw_y = skull_y + skull_size//2
    draw.ellipse((skull_x - skull_size + 5, jaw_y + 5, 
                  skull_x + skull_size - 5, jaw_y + skull_size//2 + 5), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Dientes
    tooth_width = skull_size // 6
    for i in range(4):
        x = skull_x - skull_size//2 + i*tooth_width + tooth_width//2
        draw.rectangle((x, jaw_y + 5, x + tooth_width, jaw_y + 5 + tooth_width), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Torso
    torso_width = skull_size * 1.8
    torso_height = skull_size * 2.5
    torso_x = width // 2
    torso_y = skull_y + skull_size + 5
    
    # Costillas
    rib_height = torso_height // 5
    for i in range(4):
        rib_y = torso_y + i * rib_height
        # Línea central
        draw.line([(torso_x, rib_y), (torso_x, rib_y + rib_height)], fill=BONE_COLOR, width=4)
        # Costillas horizontales
        draw.line([(torso_x - torso_width//2, rib_y), (torso_x + torso_width//2, rib_y)], fill=BONE_COLOR, width=3)
    
    # Pelvis
    pelvis_y = torso_y + torso_height
    draw.arc((torso_x - torso_width//2, pelvis_y - torso_width//3, 
              torso_x + torso_width//2, pelvis_y + torso_width//3), 0, 180, fill=BONE_COLOR, width=4)
    
    # Brazos
    arm_length = torso_height * 0.8
    
    # Brazo izquierdo
    left_shoulder_x = torso_x - torso_width//2
    left_shoulder_y = torso_y + rib_height//2
    left_elbow_x = left_shoulder_x - torso_width//4
    left_elbow_y = left_shoulder_y + arm_length//2
    left_hand_x = left_elbow_x - torso_width//8
    left_hand_y = left_elbow_y + arm_length//2
    
    # Húmero
    draw.line([(left_shoulder_x, left_shoulder_y), (left_elbow_x, left_elbow_y)], fill=BONE_COLOR, width=4)
    # Radio/Cúbito
    draw.line([(left_elbow_x, left_elbow_y), (left_hand_x, left_hand_y)], fill=BONE_COLOR, width=3)
    
    # Mano izquierda
    finger_length = arm_length // 6
    for i in range(3):
        finger_start_x = left_hand_x
        finger_start_y = left_hand_y
        finger_end_x = finger_start_x - finger_length*0.7
        finger_end_y = finger_start_y - finger_length + i*finger_length//2
        draw.line([(finger_start_x, finger_start_y), (finger_end_x, finger_end_y)], fill=BONE_COLOR, width=2)
    
    # Brazo derecho (posición de lanzamiento)
    right_shoulder_x = torso_x + torso_width//2
    right_shoulder_y = torso_y + rib_height//2
    right_elbow_x = right_shoulder_x + torso_width//4
    right_elbow_y = right_shoulder_y
    right_hand_x = right_elbow_x + torso_width//3
    right_hand_y = right_elbow_y - 5
    
    # Húmero
    draw.line([(right_shoulder_x, right_shoulder_y), (right_elbow_x, right_elbow_y)], fill=BONE_COLOR, width=4)
    # Radio/Cúbito
    draw.line([(right_elbow_x, right_elbow_y), (right_hand_x, right_hand_y)], fill=BONE_COLOR, width=3)
    
    # Sin hueso en la mano (ya lanzado)
    draw.ellipse((right_hand_x - 5, right_hand_y - 5, 
                  right_hand_x + 5, right_hand_y + 5), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Piernas similar a la posición de pie pero ligeramente inclinadas
    leg_length = torso_height * 0.9
    
    # Pierna izquierda
    left_hip_x = torso_x - torso_width//4
    left_hip_y = pelvis_y
    left_knee_x = left_hip_x - 10
    left_knee_y = left_hip_y + leg_length//2
    left_foot_x = left_knee_x - torso_width//6
    left_foot_y = left_knee_y + leg_length//2
    
    # Fémur
    draw.line([(left_hip_x, left_hip_y), (left_knee_x, left_knee_y)], fill=BONE_COLOR, width=4)
    # Tibia/Peroné
    draw.line([(left_knee_x, left_knee_y), (left_foot_x, left_foot_y)], fill=BONE_COLOR, width=3)
    
    # Pie izquierdo
    draw.line([(left_foot_x, left_foot_y), (left_foot_x - torso_width//8, left_foot_y)], fill=BONE_COLOR, width=3)
    
    # Pierna derecha (avanzada para el lanzamiento)
    right_hip_x = torso_x + torso_width//4
    right_hip_y = pelvis_y
    right_knee_x = right_hip_x + 15
    right_knee_y = right_hip_y + leg_length//2
    right_foot_x = right_knee_x + torso_width//6
    right_foot_y = right_knee_y + leg_length//2
    
    # Fémur
    draw.line([(right_hip_x, right_hip_y), (right_knee_x, right_knee_y)], fill=BONE_COLOR, width=4)
    # Tibia/Peroné
    draw.line([(right_knee_x, right_knee_y), (right_foot_x, right_foot_y)], fill=BONE_COLOR, width=3)
    
    # Pie derecho
    draw.line([(right_foot_x, right_foot_y), (right_foot_x + torso_width//8, right_foot_y)], fill=BONE_COLOR, width=3)
    
    return img

def draw_skeleton_emerging(img):
    """Dibuja un esqueleto emergiendo del suelo"""
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Similar a la pose de pie pero solo visible la parte superior
    # Reducir la visibilidad progresivamente según se acerca al suelo
    
    # Cabeza (cráneo)
    skull_x, skull_y = width // 2, height // 3
    skull_size = width // 5
    
    # Cráneo principal
    draw.ellipse((skull_x - skull_size, skull_y - skull_size, 
                  skull_x + skull_size, skull_y + skull_size), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Ojos
    eye_size = skull_size // 4
    draw.ellipse((skull_x - eye_size*2, skull_y - eye_size//2, 
                  skull_x - eye_size, skull_y + eye_size//2), fill=(0, 0, 0), outline=DARK_BONE)
    draw.ellipse((skull_x + eye_size, skull_y - eye_size//2, 
                  skull_x + eye_size*2, skull_y + eye_size//2), fill=(0, 0, 0), outline=DARK_BONE)
    
    # Brillo en los ojos
    draw.ellipse((skull_x - eye_size*2 + 2, skull_y - eye_size//2 + 2, 
                  skull_x - eye_size - 2, skull_y + eye_size//2 - 2), fill=EYE_COLOR)
    draw.ellipse((skull_x + eye_size + 2, skull_y - eye_size//2 + 2, 
                  skull_x + eye_size*2 - 2, skull_y + eye_size//2 - 2), fill=EYE_COLOR)
    
    # Mandíbula
    jaw_y = skull_y + skull_size//2
    draw.ellipse((skull_x - skull_size + 5, jaw_y, 
                  skull_x + skull_size - 5, jaw_y + skull_size//2), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Dientes
    tooth_width = skull_size // 6
    for i in range(4):
        x = skull_x - skull_size//2 + i*tooth_width + tooth_width//2
        draw.rectangle((x, jaw_y, x + tooth_width, jaw_y + tooth_width), fill=BONE_COLOR, outline=DARK_BONE)
    
    # Torso
    torso_width = skull_size * 1.8
    torso_height = skull_size * 2.5
    torso_x = width // 2
    torso_y = skull_y + skull_size + 5
    
    # Costillas (solo parcialmente visibles)
    rib_height = torso_height // 5
    for i in range(2):  # Solo las costillas superiores son visibles
        rib_y = torso_y + i * rib_height
        # Línea central
        draw.line([(torso_x, rib_y), (torso_x, rib_y + rib_height)], fill=BONE_COLOR, width=4)
        # Costillas horizontales
        draw.line([(torso_x - torso_width//2, rib_y), (torso_x + torso_width//2, rib_y)], fill=BONE_COLOR, width=3)
    
    # Solo la parte superior de la pelvis es visible
    pelvis_y = torso_y + torso_height // 1.5
    draw.line([(torso_x - torso_width//2, pelvis_y), (torso_x + torso_width//2, pelvis_y)], fill=BONE_COLOR, width=3)
    
    # Brazos parcialmente visibles
    arm_length = torso_height * 0.6
    
    # Brazo izquierdo
    left_shoulder_x = torso_x - torso_width//2
    left_shoulder_y = torso_y + rib_height//2
    left_elbow_x = left_shoulder_x - torso_width//4
    left_elbow_y = left_shoulder_y + arm_length//2
    
    # Húmero
    draw.line([(left_shoulder_x, left_shoulder_y), (left_elbow_x, left_elbow_y)], fill=BONE_COLOR, width=4)
    
    # Brazo derecho
    right_shoulder_x = torso_x + torso_width//2
    right_shoulder_y = torso_y + rib_height//2
    right_elbow_x = right_shoulder_x + torso_width//4
    right_elbow_y = right_shoulder_y + arm_length//2
    
    # Húmero
    draw.line([(right_shoulder_x, right_shoulder_y), (right_elbow_x, right_elbow_y)], fill=BONE_COLOR, width=4)
    
    # Efecto de tierra/polvo alrededor del esqueleto
    dust_y = pelvis_y + 10
    for i in range(20):
        x1 = width//2 - torso_width//2 - 20 + i * 5
        y1 = dust_y + (i % 5) * 3
        dust_size = 8 - (i % 4)
        draw.ellipse((x1, y1, x1 + dust_size, y1 + dust_size), fill=(150, 140, 130, 200))
    
    return img

def draw_projectile_bone():
    """Dibuja un hueso que será lanzado como proyectil"""
    width, height = 60, 20
    img = Image.new('RGBA', (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Hueso central
    draw.line((10, height//2, width-10, height//2), fill=BONE_COLOR, width=5)
    
    # Extremos del hueso
    draw.ellipse((5, height//2-8, 15, height//2+8), fill=BONE_COLOR, outline=DARK_BONE)
    draw.ellipse((width-15, height//2-8, width-5, height//2+8), fill=BONE_COLOR, outline=DARK_BONE)
    
    return img

def create_all_sprites():
    """Crea todos los sprites necesarios para el esqueleto"""
    # Sprite principal (64x64)
    width, height = 128, 128
    
    # Pose 1: De pie
    skeleton_standing = create_skeleton_base(width, height)
    skeleton_standing = draw_skeleton_standing(skeleton_standing)
    skeleton_standing.save(f'{output_dir}/skeleton_standing.png')
    
    # Pose 2: Lanzando
    skeleton_throwing = create_skeleton_base(width, height)
    skeleton_throwing = draw_skeleton_throwing(skeleton_throwing)
    skeleton_throwing.save(f'{output_dir}/skeleton_throwing.png')
    
    # Pose 3: Emergiendo
    skeleton_emerging = create_skeleton_base(width, height)
    skeleton_emerging = draw_skeleton_emerging(skeleton_emerging)
    skeleton_emerging.save(f'{output_dir}/skeleton_emerging.png')
    
    # Proyectil (hueso)
    bone_projectile = draw_projectile_bone()
    bone_projectile.save(f'{output_dir}/bone_projectile.png')
    
    print(f"Sprites creados en {output_dir}:")
    print("- skeleton_standing.png")
    print("- skeleton_throwing.png") 
    print("- skeleton_emerging.png")
    print("- bone_projectile.png")

if __name__ == "__main__":
    create_all_sprites() 