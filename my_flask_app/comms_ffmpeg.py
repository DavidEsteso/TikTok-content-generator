import subprocess
import os
import ffmpeg

def run_ffmpeg_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        try:
            os.remove("temp.mp4")
        except:
            print()
        raise Exception(f"Error en FFmpeg: {stderr.decode('utf-8')}")
    return stdout.decode('utf-8')

def obtener_duracion(video_path):
    probe = ffmpeg.probe(video_path)
    
    # Extraer la duración del video del resultado de la sonda
    duracion_str = next(s['duration'] for s in probe['streams'] if s['codec_type'] == 'video')
    
    # Convertir la duración a segundos
    duracion_segundos = float(duracion_str)
    return duracion_segundos