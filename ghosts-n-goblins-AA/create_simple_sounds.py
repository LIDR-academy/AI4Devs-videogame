import wave
import struct
import math
import os
import random

def generate_sine_wave(frequency, amplitude, duration, sample_rate=44100):
    """Genera una onda sinusoidal con la frecuencia, amplitud y duración dadas."""
    num_samples = int(duration * sample_rate)
    data = []
    for i in range(num_samples):
        t = float(i) / sample_rate
        sample = amplitude * math.sin(2 * math.pi * frequency * t)
        data.append(sample)
    return data

def apply_envelope(data, attack, decay, sustain, release):
    """Aplica un envolvente ADSR a los datos de onda."""
    total_samples = len(data)
    attack_samples = int(attack * total_samples)
    decay_samples = int(decay * total_samples)
    sustain_level = sustain
    release_samples = int(release * total_samples)
    
    result = data.copy()
    
    # Fase de ataque
    for i in range(attack_samples):
        if i < total_samples:
            result[i] *= (i / attack_samples)
    
    # Fase de decaimiento
    for i in range(attack_samples, attack_samples + decay_samples):
        if i < total_samples:
            decay_progress = (i - attack_samples) / decay_samples
            result[i] *= 1.0 - ((1.0 - sustain_level) * decay_progress)
    
    # La fase de sostén está implícita
    
    # Fase de liberación
    release_start = total_samples - release_samples
    for i in range(release_start, total_samples):
        if i < total_samples and i >= 0:
            release_progress = (i - release_start) / release_samples
            result[i] *= sustain_level * (1.0 - release_progress)
    
    return result

def add_noise(data, noise_level):
    """Añade ruido blanco a los datos."""
    result = data.copy()
    for i in range(len(result)):
        noise = random.uniform(-noise_level, noise_level)
        result[i] += noise
    return result

def normalize(data):
    """Normaliza los datos para evitar clipping."""
    max_amplitude = max(abs(min(data)), abs(max(data)))
    if max_amplitude > 0:
        scale_factor = 0.9 / max_amplitude  # Usar 0.9 para dejar margen
        result = [sample * scale_factor for sample in data]
        return result
    return data

def save_wav(filename, data, sample_rate=44100):
    """Guarda los datos como un archivo WAV."""
    # Asegurar que el directorio existe
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Preparar datos para archivo WAV
    max_amplitude = 32767  # Para formato de 16 bits
    wav_data = []
    for sample in data:
        # Convertir float a formato de 16 bits
        wav_sample = int(sample * max_amplitude)
        wav_sample = max(min(wav_sample, 32767), -32768)  # Límites
        wav_data.append(struct.pack('h', wav_sample))
    
    wav_data = b''.join(wav_data)
    
    # Crear archivo WAV
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 2 bytes (16 bits)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(wav_data)

def create_boss_roar():
    """Crea un rugido para el jefe."""
    sample_rate = 44100
    duration = 1.2
    
    # Combinar varias ondas con diferentes frecuencias
    base_wave = generate_sine_wave(80, 0.4, duration, sample_rate)
    mid_wave = generate_sine_wave(160, 0.3, duration, sample_rate)
    high_wave = generate_sine_wave(240, 0.2, duration, sample_rate)
    
    # Combinar ondas
    combined_wave = []
    for i in range(len(base_wave)):
        combined_wave.append(base_wave[i] + mid_wave[i] + high_wave[i])
    
    # Aplicar efectos
    wave_data = apply_envelope(combined_wave, 0.1, 0.2, 0.6, 0.3)
    wave_data = add_noise(wave_data, 0.2)
    wave_data = normalize(wave_data)
    
    return wave_data

def create_boss_hit():
    """Crea un sonido de golpe al jefe."""
    sample_rate = 44100
    duration = 0.3
    
    # Crear onda base
    wave_data = generate_sine_wave(150, 0.5, duration, sample_rate)
    
    # Añadir tono más alto para impacto
    high_tone = generate_sine_wave(300, 0.3, duration, sample_rate)
    for i in range(len(wave_data)):
        wave_data[i] += high_tone[i]
    
    # Aplicar efectos
    wave_data = apply_envelope(wave_data, 0.05, 0.1, 0.4, 0.5)
    wave_data = add_noise(wave_data, 0.1)
    wave_data = normalize(wave_data)
    
    return wave_data

def create_boss_attack():
    """Crea un sonido de ataque del jefe."""
    sample_rate = 44100
    duration = 0.5
    
    # Crear sonido base
    wave_data = []
    for i in range(int(duration * sample_rate)):
        t = float(i) / sample_rate
        # Frecuencia ascendente para efecto de carga
        freq = 100 + 200 * t
        sample = 0.6 * math.sin(2 * math.pi * freq * t)
        wave_data.append(sample)
    
    # Aplicar efectos
    wave_data = apply_envelope(wave_data, 0.2, 0.3, 0.5, 0.2)
    wave_data = add_noise(wave_data, 0.05)
    wave_data = normalize(wave_data)
    
    return wave_data

def create_boss_death():
    """Crea un sonido de muerte del jefe."""
    sample_rate = 44100
    duration = 1.5
    
    # Crear onda base
    wave_data = []
    for i in range(int(duration * sample_rate)):
        t = float(i) / sample_rate
        # Frecuencia descendente para efecto de caída
        freq = max(50, 200 - 100 * t)
        sample = 0.5 * math.sin(2 * math.pi * freq * t)
        
        # Añadir pulso lento de baja frecuencia
        pulse = 0.3 * math.sin(2 * math.pi * 3 * t)
        sample += pulse
        
        wave_data.append(sample)
    
    # Aplicar efectos
    wave_data = apply_envelope(wave_data, 0.05, 0.1, 0.7, 0.5)
    wave_data = add_noise(wave_data, 0.3)  # Más ruido para la explosión
    wave_data = normalize(wave_data)
    
    return wave_data

def create_fireball_impact():
    """Crea un sonido de impacto de bola de fuego."""
    sample_rate = 44100
    duration = 0.4
    
    # Crear sonido base de "whoosh" + impacto
    wave_data = []
    for i in range(int(duration * sample_rate)):
        t = float(i) / sample_rate
        
        # Componente de silbido
        freq1 = 200 + 100 * t
        whoosh = 0.3 * math.sin(2 * math.pi * freq1 * t)
        
        # Componente de impacto (inicia después de un poco)
        impact = 0
        if t > 0.2:
            impact_t = t - 0.2
            impact_freq = 150 - 100 * impact_t
            impact = 0.6 * math.sin(2 * math.pi * impact_freq * impact_t)
        
        sample = whoosh + impact
        wave_data.append(sample)
    
    # Aplicar efectos
    wave_data = apply_envelope(wave_data, 0.1, 0.2, 0.5, 0.3)
    wave_data = add_noise(wave_data, 0.15)
    wave_data = normalize(wave_data)
    
    return wave_data

def main():
    output_dir = 'ghosts-n-goblins/assets/audio'
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generando efectos de sonido para el jefe...")
    
    # Rugido del jefe
    wave_data = create_boss_roar()
    output_path = os.path.join(output_dir, 'boss-roar.wav')
    save_wav(output_path, wave_data)
    print(f"✓ Sonido de rugido de jefe guardado en {output_path}")
    
    # Golpe al jefe
    wave_data = create_boss_hit()
    output_path = os.path.join(output_dir, 'boss-hit.wav')
    save_wav(output_path, wave_data)
    print(f"✓ Sonido de golpe al jefe guardado en {output_path}")
    
    # Ataque del jefe
    wave_data = create_boss_attack()
    output_path = os.path.join(output_dir, 'boss-attack.wav')
    save_wav(output_path, wave_data)
    print(f"✓ Sonido de ataque del jefe guardado en {output_path}")
    
    # Muerte del jefe
    wave_data = create_boss_death()
    output_path = os.path.join(output_dir, 'boss-death.wav')
    save_wav(output_path, wave_data)
    print(f"✓ Sonido de muerte del jefe guardado en {output_path}")
    
    # Impacto de bola de fuego
    wave_data = create_fireball_impact()
    output_path = os.path.join(output_dir, 'fireball-impact.wav')
    save_wav(output_path, wave_data)
    print(f"✓ Sonido de impacto de bola de fuego guardado en {output_path}")
    
    print("¡Todos los efectos de sonido del jefe fueron generados con éxito!")

if __name__ == "__main__":
    main() 