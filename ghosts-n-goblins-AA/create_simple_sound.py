import os

# Asegurar que el directorio existe
os.makedirs("ghosts-n-goblins/assets/audio", exist_ok=True)

# Crear un archivo MP3 vacío (placeholder)
with open("ghosts-n-goblins/assets/audio/double-jump.mp3", "wb") as f:
    # Encabezado MP3 muy básico (no reproduce sonido pero es un archivo MP3 válido)
    f.write(bytes.fromhex('FFFB9064000001BEE3F8'))

print("Archivo de sonido placeholder creado: double-jump.mp3") 