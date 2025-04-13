import numpy as np
from scipy.io import wavfile
import os

def generate_sine_wave(freq, duration, sample_rate=44100):
    """Genera una onda sinusoidal con la frecuencia y duración dadas"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    wave = np.sin(2 * np.pi * freq * t)
    return wave

def add_attack_envelope(wave, attack_time=0.05, release_time=0.1, sample_rate=44100):
    """Aplica un envolvente ADSR simple (solo ataque y liberación)"""
    attack_samples = int(attack_time * sample_rate)
    release_samples = int(release_time * sample_rate)
    total_samples = len(wave)
    
    # Envolvente de ataque (fade in)
    if attack_samples > 0:
        attack_env = np.linspace(0, 1, attack_samples)
        wave[:attack_samples] *= attack_env
    
    # Envolvente de liberación (fade out)
    if release_samples > 0 and release_samples < total_samples:
        release_env = np.linspace(1, 0, release_samples)
        wave[-release_samples:] *= release_env
    
    return wave

def add_noise(wave, noise_level=0.1):
    """Añade ruido blanco a la onda"""
    noise = np.random.normal(0, noise_level, len(wave))
    return wave + noise

def apply_distortion(wave, amount=0.5):
    """Aplica distorsión a la onda"""
    return np.tanh(amount * wave)

def create_boss_roar():
    """Crea un rugido para el jefe"""
    sample_rate = 44100
    duration = 1.2
    
    # Base del rugido: frecuencia baja con modulación
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    freq_mod = 2 + np.sin(2 * np.pi * 2 * t) * 1  # Modulación de frecuencia
    wave = np.sin(2 * np.pi * 80 * t + 5 * np.sin(2 * np.pi * freq_mod * t))
    
    # Añadir componentes de alta frecuencia para aspereza
    high_freq = np.sin(2 * np.pi * 150 * t) * 0.3
    very_high_freq = np.sin(2 * np.pi * 220 * t) * 0.1
    wave = wave + high_freq + very_high_freq
    
    # Aplicar efectos
    wave = add_attack_envelope(wave, attack_time=0.1, release_time=0.3)
    wave = add_noise(wave, noise_level=0.15)
    wave = apply_distortion(wave, amount=2.0)
    
    # Normalizar
    wave = wave / np.max(np.abs(wave))
    
    # Convertir a int16
    wave_int = (wave * 32767).astype(np.int16)
    
    return sample_rate, wave_int

def create_boss_hit():
    """Crea un sonido de golpe al jefe"""
    sample_rate = 44100
    duration = 0.3
    
    # Sonido base: pulso con decaimiento rápido
    wave = generate_sine_wave(150, duration, sample_rate)
    
    # Añadir componentes de alta frecuencia
    wave += generate_sine_wave(300, duration, sample_rate) * 0.5
    wave += generate_sine_wave(450, duration, sample_rate) * 0.3
    
    # Aplicar efectos
    wave = add_attack_envelope(wave, attack_time=0.01, release_time=0.2)
    wave = add_noise(wave, noise_level=0.1)
    
    # Normalizar
    wave = wave / np.max(np.abs(wave))
    
    # Convertir a int16
    wave_int = (wave * 32767).astype(np.int16)
    
    return sample_rate, wave_int

def create_boss_attack():
    """Crea un sonido de ataque del jefe"""
    sample_rate = 44100
    duration = 0.5
    
    # Sonido base: barrido ascendente de frecuencia
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    freq = 100 + 200 * t  # Barrido de frecuencia de 100 a 300 Hz
    wave = np.sin(2 * np.pi * freq * t)
    
    # Añadir componentes de frecuencia
    wave += np.sin(2 * np.pi * (freq * 1.5) * t) * 0.4
    wave += np.sin(2 * np.pi * (freq * 2.0) * t) * 0.2
    
    # Aplicar efectos
    wave = add_attack_envelope(wave, attack_time=0.05, release_time=0.15)
    wave = add_noise(wave, noise_level=0.05)
    wave = apply_distortion(wave, amount=1.5)
    
    # Normalizar
    wave = wave / np.max(np.abs(wave))
    
    # Convertir a int16
    wave_int = (wave * 32767).astype(np.int16)
    
    return sample_rate, wave_int

def create_boss_death():
    """Crea un sonido de muerte del jefe"""
    sample_rate = 44100
    duration = 1.5
    
    # Base del sonido: frecuencia descendente
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    freq = 200 - 150 * t  # Barrido descendente
    wave = np.sin(2 * np.pi * np.maximum(freq, 50) * t)
    
    # Añadir explosión (pulso de ruido)
    explosion = np.random.normal(0, 1, int(sample_rate * duration))
    explosion_env = np.exp(-4 * t)  # Envolvente exponencial
    wave += explosion * explosion_env * 0.7
    
    # Añadir componentes graves pulsantes
    pulse = np.sin(2 * np.pi * 3 * t)  # Pulso lento a 3 Hz
    wave += np.sin(2 * np.pi * 70 * t) * (0.5 + 0.5 * pulse) * 0.6
    
    # Aplicar efectos
    wave = add_attack_envelope(wave, attack_time=0.02, release_time=0.5)
    wave = apply_distortion(wave, amount=1.2)
    
    # Normalizar
    wave = wave / np.max(np.abs(wave))
    
    # Convertir a int16
    wave_int = (wave * 32767).astype(np.int16)
    
    return sample_rate, wave_int

def create_fireball_impact():
    """Crea un sonido de impacto de bola de fuego"""
    sample_rate = 44100
    duration = 0.4
    
    # Base del sonido: ruido con envolvente
    noise = np.random.normal(0, 1, int(sample_rate * duration))
    
    # Filtrar el ruido para darle carácter
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    filter_env = np.exp(-10 * t)  # Envolvente exponencial
    filtered_noise = noise * filter_env
    
    # Añadir componentes tonales
    wave = filtered_noise * 0.7
    wave += np.sin(2 * np.pi * 120 * t) * np.exp(-15 * t) * 0.3
    wave += np.sin(2 * np.pi * 220 * t) * np.exp(-20 * t) * 0.2
    
    # Aplicar efectos
    wave = add_attack_envelope(wave, attack_time=0.01, release_time=0.2)
    wave = apply_distortion(wave, amount=1.0)
    
    # Normalizar
    wave = wave / np.max(np.abs(wave))
    
    # Convertir a int16
    wave_int = (wave * 32767).astype(np.int16)
    
    return sample_rate, wave_int

def main():
    # Crear directorio para los sonidos si no existe
    output_dir = 'ghosts-n-goblins/assets/audio'
    os.makedirs(output_dir, exist_ok=True)
    
    # Generar y guardar cada sonido
    print("Generando efectos de sonido para el jefe...")
    
    # Rugido del jefe
    sample_rate, wave = create_boss_roar()
    output_path = os.path.join(output_dir, 'boss-roar.wav')
    wavfile.write(output_path, sample_rate, wave)
    print(f"✓ Sonido de rugido de jefe guardado en {output_path}")
    
    # Golpe al jefe
    sample_rate, wave = create_boss_hit()
    output_path = os.path.join(output_dir, 'boss-hit.wav')
    wavfile.write(output_path, sample_rate, wave)
    print(f"✓ Sonido de golpe al jefe guardado en {output_path}")
    
    # Ataque del jefe
    sample_rate, wave = create_boss_attack()
    output_path = os.path.join(output_dir, 'boss-attack.wav')
    wavfile.write(output_path, sample_rate, wave)
    print(f"✓ Sonido de ataque del jefe guardado en {output_path}")
    
    # Muerte del jefe
    sample_rate, wave = create_boss_death()
    output_path = os.path.join(output_dir, 'boss-death.wav')
    wavfile.write(output_path, sample_rate, wave)
    print(f"✓ Sonido de muerte del jefe guardado en {output_path}")
    
    # Impacto de bola de fuego
    sample_rate, wave = create_fireball_impact()
    output_path = os.path.join(output_dir, 'fireball-impact.wav')
    wavfile.write(output_path, sample_rate, wave)
    print(f"✓ Sonido de impacto de bola de fuego guardado en {output_path}")
    
    print("¡Todos los efectos de sonido del jefe fueron generados con éxito!")

if __name__ == "__main__":
    main() 