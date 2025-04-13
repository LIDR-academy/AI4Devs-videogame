import numpy as np
from scipy.io.wavfile import write
import os
from pydub import AudioSegment

# Asegurar que el directorio existe
os.makedirs("ghosts-n-goblins/assets/audio", exist_ok=True)

# Función para crear un sonido de doble salto
def create_double_jump_sound():
    # Configuración del sonido
    sample_rate = 44100  # Hz
    duration = 0.3  # segundos
    
    # Generar una onda sinusoidal que sube en frecuencia (efecto "whoosh")
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Crear un sonido que sube en tono
    start_freq = 300
    end_freq = 2500
    frequency = np.linspace(start_freq, end_freq, len(t))
    
    # Generar la onda
    signal = np.sin(2 * np.pi * frequency * t)
    
    # Aplicar una envolvente para suavizar el inicio y final
    envelope = np.ones_like(signal)
    attack = int(0.05 * sample_rate)
    release = int(0.1 * sample_rate)
    
    for i in range(attack):
        envelope[i] = i / attack
    for i in range(release):
        envelope[-i-1] = i / release
    
    signal = signal * envelope * 0.3  # reducir volumen
    
    # Convertir a formato de 16 bits
    audio = np.int16(signal * 32767)
    
    # Guardar como archivo WAV
    temp_wav_path = "temp_double_jump.wav"
    write(temp_wav_path, sample_rate, audio)
    
    # Convertir a MP3
    sound = AudioSegment.from_wav(temp_wav_path)
    sound.export("ghosts-n-goblins/assets/audio/double-jump.mp3", format="mp3", bitrate="192k")
    
    # Eliminar el archivo WAV temporal
    os.remove(temp_wav_path)
    
    print("Sonido de doble salto creado: double-jump.mp3")

try:
    create_double_jump_sound()
except ImportError:
    print("ERROR: No se pudo crear el sonido. Asegúrate de tener instalados numpy, scipy y pydub.")
    print("Puedes instalarlos con: pip install numpy scipy pydub")
    # Si falla, crear un archivo vacío para que el juego no de error
    with open("ghosts-n-goblins/assets/audio/double-jump.mp3", "wb") as f:
        f.write(b'') 