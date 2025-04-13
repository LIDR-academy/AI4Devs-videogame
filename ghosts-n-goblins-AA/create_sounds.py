import numpy as np
import wave
import struct
import os
import math
import random

# Asegurar que el directorio existe
sounds_dir = 'ghosts-n-goblins/assets/audio'
os.makedirs(sounds_dir, exist_ok=True)

# Configuración global
SAMPLE_RATE = 44100
AMPLITUDE = 32767  # Máximo para 16-bit

def save_wav(filename, data):
    """Guardar datos de audio en un archivo WAV."""
    # Asegurar que los datos estén dentro del rango [-1, 1]
    data = np.clip(data, -1, 1)
    
    # Convertir a 16-bit
    data_16bit = (data * AMPLITUDE).astype(np.int16)
    
    # Guardar como WAV
    with wave.open(filename, 'w') as wav_file:
        # Configurar parámetros: nchannels, sampwidth, framerate, nframes, comptype, compname
        wav_file.setparams((1, 2, SAMPLE_RATE, len(data_16bit), 'NONE', 'not compressed'))
        
        # Convertir a bytes y escribir
        wav_file.writeframes(data_16bit.tobytes())
    
    print(f"Archivo de sonido guardado en: {filename}")

def create_sine_wave(freq, duration):
    """Crear una onda sinusoidal."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    return np.sin(2 * np.pi * freq * t)

def create_square_wave(freq, duration):
    """Crear una onda cuadrada."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    return np.sign(np.sin(2 * np.pi * freq * t))

def create_sawtooth_wave(freq, duration):
    """Crear una onda de sierra."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    return 2 * (t * freq - np.floor(t * freq + 0.5))

def create_triangle_wave(freq, duration):
    """Crear una onda triangular."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    return 2 * np.abs(2 * (t * freq - np.floor(t * freq + 0.5))) - 1

def create_noise(duration, color='white'):
    """Crear ruido blanco."""
    samples = int(SAMPLE_RATE * duration)
    noise = np.random.uniform(-1, 1, samples)
    
    if color == 'pink':
        # Filtro simple para simular ruido rosa
        # (más energía en frecuencias bajas)
        noise_fft = np.fft.rfft(noise)
        freq = np.fft.rfftfreq(len(noise), 1/SAMPLE_RATE)
        freq[0] = 1  # Evitar división por cero
        filter_curve = 1 / np.sqrt(freq)
        noise_fft = noise_fft * filter_curve
        noise = np.fft.irfft(noise_fft)
        noise = noise / np.max(np.abs(noise))  # Normalizar
    
    return noise

def create_envelope(duration, attack, decay, sustain, release, sustain_level=0.8):
    """Crear una envolvente ADSR."""
    samples = int(SAMPLE_RATE * duration)
    attack_samples = int(SAMPLE_RATE * attack)
    decay_samples = int(SAMPLE_RATE * decay)
    sustain_samples = int(SAMPLE_RATE * sustain)
    release_samples = int(SAMPLE_RATE * release)
    
    # Crear arrays de tiempo para cada fase
    attack_env = np.linspace(0, 1, attack_samples) if attack_samples > 0 else np.array([])
    decay_env = np.linspace(1, sustain_level, decay_samples) if decay_samples > 0 else np.array([])
    sustain_env = np.ones(sustain_samples) * sustain_level if sustain_samples > 0 else np.array([])
    release_env = np.linspace(sustain_level, 0, release_samples) if release_samples > 0 else np.array([])
    
    # Concatenar las fases
    envelope = np.concatenate([attack_env, decay_env, sustain_env, release_env])
    
    # Ajustar al tamaño correcto
    if len(envelope) < samples:
        envelope = np.pad(envelope, (0, samples - len(envelope)), 'constant')
    else:
        envelope = envelope[:samples]
    
    return envelope

def create_chest_open_sound():
    """Crear un sonido para cuando se abre un cofre."""
    duration = 0.8
    
    # Componentes del sonido
    base_freq = 300
    sine1 = create_sine_wave(base_freq, duration) * 0.5
    sine2 = create_sine_wave(base_freq * 1.5, duration) * 0.3
    
    # Combinar
    sound = sine1 + sine2
    
    # Aplicar envolvente
    envelope = create_envelope(duration, 0.05, 0.1, 0.2, 0.45, 0.6)
    sound = sound * envelope
    
    # Efecto de apertura (barrido ascendente)
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    chirp = np.sin(2 * np.pi * (base_freq + t * 500) * t) * 0.3
    
    # Mezclar
    sound = sound + chirp * envelope
    
    # Normalizar
    sound = sound / np.max(np.abs(sound)) * 0.9
    
    # Guardar como WAV
    save_wav(os.path.join(sounds_dir, 'chest-open.wav'), sound)
    return os.path.join(sounds_dir, 'chest-open.wav')

def create_powerup_collect_sound():
    """Crear un sonido para cuando se recoge un power-up."""
    duration = 0.5
    
    # Crear un sonido con frecuencia ascendente
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples, False)
    
    # Inicio y fin de la frecuencia
    start_freq = 400
    end_freq = 1200
    
    # Calcular el barrido de frecuencia logarítmico
    frequencies = np.logspace(np.log10(start_freq), np.log10(end_freq), samples)
    
    # Generar la fase acumulativa
    phase = 2 * np.pi * np.cumsum(frequencies) / SAMPLE_RATE
    
    # Generar el sonido con fase acumulativa
    sound = np.sin(phase)
    
    # Añadir un segundo tono más agudo
    sound2 = np.sin(phase * 1.5) * 0.3
    sound = sound + sound2
    
    # Aplicar envolvente
    envelope = create_envelope(duration, 0.05, 0.1, 0.2, 0.15, 0.7)
    sound = sound * envelope
    
    # Normalizar
    sound = sound / np.max(np.abs(sound)) * 0.9
    
    # Guardar como WAV
    save_wav(os.path.join(sounds_dir, 'powerup-collect.wav'), sound)
    return os.path.join(sounds_dir, 'powerup-collect.wav')

def create_invincible_sound():
    """Crear un sonido para el power-up de invencibilidad."""
    duration = 0.7
    
    # Crear un sonido brillante y energético
    base_freq = 500
    sine1 = create_sine_wave(base_freq, duration) * 0.4
    sine2 = create_sine_wave(base_freq * 2, duration) * 0.3
    sine3 = create_sine_wave(base_freq * 3, duration) * 0.2
    
    # Combinar
    sound = sine1 + sine2 + sine3
    
    # Modulación para un efecto "poderoso"
    mod_freq = 10
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    modulation = (np.sin(2 * np.pi * mod_freq * t) + 1) / 2  # Oscila entre 0 y 1
    sound = sound * (0.7 + modulation * 0.3)
    
    # Aplicar envolvente
    envelope = create_envelope(duration, 0.05, 0.1, 0.4, 0.15, 0.8)
    sound = sound * envelope
    
    # Normalizar
    sound = sound / np.max(np.abs(sound)) * 0.9
    
    # Guardar como WAV
    save_wav(os.path.join(sounds_dir, 'invincible.wav'), sound)
    return os.path.join(sounds_dir, 'invincible.wav')

def create_magic_sound():
    """Crear un sonido para el power-up mágico."""
    duration = 0.7
    
    # Crear un sonido "mágico" con múltiples tonos
    base_freq = 600
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples, False)
    
    # Sonido de base con oscilación
    wave1 = np.sin(2 * np.pi * base_freq * t) * 0.4
    wave2 = np.sin(2 * np.pi * (base_freq * 1.5) * t) * 0.3
    
    # Sonido de "campana" o "cristal"
    bell = np.sin(2 * np.pi * (base_freq * 2) * t) * np.exp(-4 * t) * 0.5
    
    # Combinar
    sound = wave1 + wave2 + bell
    
    # Aplicar envolvente
    envelope = create_envelope(duration, 0.05, 0.2, 0.2, 0.25, 0.7)
    sound = sound * envelope
    
    # Añadir "destellos" en frecuencias altas
    for _ in range(3):
        sparkle_freq = random.uniform(1500, 2500)
        sparkle_time = random.uniform(0.1, 0.5)
        sparkle_idx = int(sparkle_time * SAMPLE_RATE)
        sparkle_len = int(0.1 * SAMPLE_RATE)
        
        if sparkle_idx + sparkle_len <= samples:
            sparkle = np.sin(2 * np.pi * sparkle_freq * t[sparkle_idx:sparkle_idx+sparkle_len])
            sparkle_env = np.linspace(0, 1, sparkle_len//2)
            sparkle_env = np.concatenate([sparkle_env, sparkle_env[::-1]])
            sound[sparkle_idx:sparkle_idx+sparkle_len] += sparkle * sparkle_env * 0.3
    
    # Normalizar
    sound = sound / np.max(np.abs(sound)) * 0.9
    
    # Guardar como WAV
    save_wav(os.path.join(sounds_dir, 'magic.wav'), sound)
    return os.path.join(sounds_dir, 'magic.wav')

def create_armor_sound():
    """Crear un sonido para el power-up de armadura."""
    duration = 0.6
    
    # Crear un sonido metálico
    base_freq = 350
    harmonic_freqs = [base_freq, base_freq * 1.2, base_freq * 1.5, base_freq * 1.8, base_freq * 2.5]
    harmonic_amps = [0.5, 0.3, 0.2, 0.15, 0.1]  # Amplitudes
    
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples, False)
    
    # Combinar armónicos
    sound = np.zeros(samples)
    for freq, amp in zip(harmonic_freqs, harmonic_amps):
        sound += create_sine_wave(freq, duration) * amp
    
    # Añadir un poco de ruido para el efecto metálico
    noise = create_noise(duration) * 0.1
    sound += noise
    
    # Aplicar envolvente con decay rápido (característica de sonidos metálicos)
    envelope = create_envelope(duration, 0.01, 0.15, 0.1, 0.34, 0.5)
    sound = sound * envelope
    
    # Normalizar
    sound = sound / np.max(np.abs(sound)) * 0.9
    
    # Guardar como WAV
    save_wav(os.path.join(sounds_dir, 'armor.wav'), sound)
    return os.path.join(sounds_dir, 'armor.wav')

def create_points_sound():
    """Crear un sonido para el power-up de puntos."""
    duration = 0.5
    
    # Sonido tipo "monedas" con pequeños "dings" en secuencia
    samples = int(SAMPLE_RATE * duration)
    note_count = 4
    note_duration = duration / note_count
    
    # Frecuencias ascendentes
    frequencies = [400, 500, 600, 700]
    
    # Crear cada nota
    sound = np.zeros(samples)
    for i, freq in enumerate(frequencies):
        start_idx = int(i * note_duration * SAMPLE_RATE)
        end_idx = int((i + 1) * note_duration * SAMPLE_RATE)
        if end_idx > samples:
            end_idx = samples
        
        note_samples = end_idx - start_idx
        t = np.linspace(0, note_duration, note_samples, False)
        
        # Crear nota con envolvente
        note = np.sin(2 * np.pi * freq * t)
        note_env = np.exp(-5 * t)  # Decay rápido para efecto de "ding"
        note = note * note_env
        
        # Añadir al sonido principal
        sound[start_idx:end_idx] += note
    
    # Aplicar envolvente general
    envelope = create_envelope(duration, 0.01, 0.1, 0.2, 0.19, 0.7)
    sound = sound * envelope
    
    # Normalizar
    sound = sound / np.max(np.abs(sound)) * 0.9
    
    # Guardar como WAV
    save_wav(os.path.join(sounds_dir, 'points.wav'), sound)
    return os.path.join(sounds_dir, 'points.wav')

def create_all_sounds():
    """Crear todos los efectos de sonido."""
    print("Generando efectos de sonido...")
    
    try:
        create_chest_open_sound()
        create_powerup_collect_sound()
        create_invincible_sound()
        create_magic_sound()
        create_armor_sound()
        create_points_sound()
        
        print("¡Todos los efectos de sonido han sido generados!")
    except Exception as e:
        print(f"Error al generar sonidos: {e}")

if __name__ == "__main__":
    create_all_sounds() 