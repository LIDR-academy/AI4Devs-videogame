from PIL import Image, ImageDraw
import os

# Asegurar que el directorio existe
os.makedirs("ghosts-n-goblins/assets/effects", exist_ok=True)

# Crear varias imágenes para el efecto de partículas con diferentes tamaños y brillos
def create_jump_particles():
    # Crear varias partículas con diferentes estilos
    particle_sizes = [16, 12, 8]
    particle_colors = [
        (255, 255, 255, 230),  # Blanco brillante
        (200, 255, 255, 200),  # Azul claro
        (255, 240, 180, 180),  # Amarillo suave
        (255, 200, 255, 200),  # Rosa claro
    ]
    
    # Generar múltiples partículas para animación
    for i, size in enumerate(particle_sizes):
        for j, color in enumerate(particle_colors):
            index = i * len(particle_colors) + j
            
            # Crear imagen con transparencia
            img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # Dibujar un círculo brillante como partícula
            draw.ellipse((0, 0, size, size), fill=color)
            
            # Añadir un brillo central más intenso
            center_size = max(2, int(size * 0.4))
            offset = (size - center_size) // 2
            draw.ellipse(
                (offset, offset, size - offset, size - offset), 
                fill=(255, 255, 255, min(255, color[3] + 30))
            )
            
            # Crear versiones de la partícula en diferentes estados de desvanecimiento
            for alpha in [0.8, 0.6, 0.4, 0.2]:
                fade_img = img.copy()
                # Ajustar transparencia
                pixels = fade_img.load()
                for x in range(fade_img.width):
                    for y in range(fade_img.height):
                        r, g, b, a = pixels[x, y]
                        pixels[x, y] = (r, g, b, int(a * alpha))
                
                # Guardar imagen con nombre que indica su secuencia de desvanecimiento
                fade_img.save(f"ghosts-n-goblins/assets/effects/jump_particle_{index}_{int(alpha*10)}.png")
            
            # Guardar la imagen original
            img.save(f"ghosts-n-goblins/assets/effects/jump_particle_{index}.png")
    
    # Crear una imagen de estela (trail) para el efecto
    trail_img = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(trail_img)
    
    # Crear un efecto de estela luminosa
    draw.ellipse((4, 0, 20, 24), fill=(255, 255, 255, 100))
    draw.ellipse((0, 4, 24, 20), fill=(255, 255, 255, 100))
    
    # Guardar la imagen de estela
    trail_img.save("ghosts-n-goblins/assets/effects/jump_trail.png")
    
    print("Imágenes de partículas para salto creadas")

# Ejecutar la función
create_jump_particles() 