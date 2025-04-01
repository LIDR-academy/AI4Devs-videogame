from pydub import AudioSegment
from pydub.generators import Sine
import os

# Crear directorio si no existe
os.makedirs('ghosts-n-goblins/assets/audio', exist_ok=True)

# Función para crear un tono simple
def create_tone(filename, freq=440, duration=5000):
    # Generar un tono de la frecuencia y duración especificadas
    sine_wave = Sine(freq)
    # Crear un segmento de audio más largo para asegurar que se reproduzca bien
    audio = sine_wave.to_audio_segment(duration=duration)
    
    # Aumentar el volumen para asegurar que sea audible
    audio = audio + 6  # Aumentar en 6dB
    
    # Añadir fade-in y fade-out para evitar clicks
    audio = audio.fade_in(100).fade_out(100)
    
    # Guardar como MP3 con alta calidad
    audio.export(filename, format="mp3", bitrate="192k")
    print(f"Archivo creado: {filename}")

# Crear archivos de audio para el juego (más largos)
create_tone('ghosts-n-goblins/assets/audio/title-music.mp3', freq=330, duration=10000)
create_tone('ghosts-n-goblins/assets/audio/game-music.mp3', freq=440, duration=10000)
create_tone('ghosts-n-goblins/assets/audio/gameover-music.mp3', freq=220, duration=10000)

print("Archivos de audio creados con éxito") 