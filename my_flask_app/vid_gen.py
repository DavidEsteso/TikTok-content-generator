import ffmpeg
import random
import os
import subprocess
import math

def get_video_duration(input_video_path):
    try:
        probe = ffmpeg.probe(input_video_path)
        duration = float(probe['format']['duration'])
        return duration
    except ffmpeg.Error as e:
        print(f"Error: {e}")
        return None

def create_short_video(random_vid,id,input_video_path, output_video_path, fragment_duration=5, total_duration=40):
    # Obtener la duración del video original
    video_duration = get_video_duration(input_video_path)
    if (random_vid):        
        if video_duration is None:
            print("No se pudo obtener la duración del video.")
            return
        
        # Calcular el número de fragmentos necesarios
        num_fragments = total_duration // fragment_duration
        
        # Generar puntos de inicio aleatorios para los fragmentos
        start_points = []
        while len(start_points) < num_fragments:
            start = random.randint(0, int(video_duration) - fragment_duration)
            # Asegurarse de que los puntos de inicio no estén demasiado cerca uno del otro
            if all(abs(start - other_start) >= (fragment_duration) for other_start in start_points):
                start_points.append(start)
        #start_points.sort()
        
        # Crear los comandos de ffmpeg para extraer los fragmentos
        fragment_files = []
        for i, start in enumerate(start_points):
            fragment_file = f"fragment_{i}_{id}.mp4"
            cmd = (
                f'ffmpeg -y -ss {start} -i "{input_video_path}" -t {fragment_duration} '
                f'-c:v libx264 -c:a aac -strict experimental "{fragment_file}"'
            )
            subprocess.run(cmd, shell=True)
            fragment_files.append(fragment_file)
        
        # Crear el archivo de lista para concatenación
        with open(f"concat_list_{id}.txt", "w") as f:
            for fragment_file in fragment_files:
                f.write(f"file '{os.path.abspath(fragment_file)}'\n")
        
        # Concatenar los fragmentos
        cmd = (
            f'ffmpeg -y -f concat -safe 0 -i concat_list_{id}.txt -c:v libx264 -c:a aac -strict experimental '
            f'"temp_{id}.mp4"'
        )
        subprocess.run(cmd, shell=True)

        cmd = (
            f'ffmpeg -y -i "temp_{id}.mp4" -vf "scale=iw*min(1080/iw\,1920/ih):ih*min(1080/iw\,1920/ih),'
            f'pad=1080:1920:(1080-iw*min(1080/iw\,1920/ih))/2:(1920-ih*min(1080/iw\,1920/ih))/2" '
            f'-c:v libx264 -c:a aac -strict experimental "{output_video_path}"'
        )
        subprocess.run(cmd, shell=True)
        
        # Eliminar los archivos temporales
        for fragment_file in fragment_files:
            os.remove(fragment_file)
        os.remove(f"concat_list_{id}.txt")
    else:
        videos_bucle=math.ceil(total_duration/video_duration)

        bucle_files = []
        for i in range(videos_bucle):
            bucle_file = f"fragment_{i}_{id}.mp4"
            cmd = (
                f'ffmpeg -y -i "{input_video_path}" '
                f'-c:v libx264 -c:a aac -strict experimental "{bucle_file}"'
            )
            subprocess.run(cmd, shell=True)
            bucle_files.append(bucle_file)
        
        # Crear el archivo de lista para concatenación
        with open(f"concat_list_{id}.txt", "w") as f:
            for bucle_file in bucle_files:
                f.write(f"file '{os.path.abspath(bucle_file)}'\n")
        
        # Concatenar los fragmentos
        cmd = (
            f'ffmpeg -y -f concat -safe 0 -i concat_list_{id}.txt -c:v libx264 -c:a aac -strict experimental '
            f'"temp_{id}.mp4"'
        )
        subprocess.run(cmd, shell=True)

        cmd = (
            f'ffmpeg -y -i "temp_{id}.mp4" -t {total_duration} -vf "scale=iw*min(1080/iw\,1920/ih):ih*min(1080/iw\,1920/ih),'
            f'pad=1080:1920:(1080-iw*min(1080/iw\,1920/ih))/2:(1920-ih*min(1080/iw\,1920/ih))/2" '
            f'-c:v libx264 -c:a aac -strict experimental "{output_video_path}"'
        )
        subprocess.run(cmd, shell=True)
        
        # Eliminar los archivos temporales
        for bucle_file in bucle_files:
            os.remove(bucle_file)
        os.remove(f"concat_list_{id}.txt")

