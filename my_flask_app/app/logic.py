import random
from pytube import YouTube
from gtts import gTTS
import random_vid_gen
import add_text
import os
import comms_ffmpeg
import shutil


def generate_video(narration, youtube_link, bacground_music):
    # Aquí iría la lógica para generar el video
    # Por ahora, solo devolvemos un mensaje simulado
    download_video_from_youtube(youtube_link)
    text_to_speech(narration)
    download_audio_from_youtube(bacground_music)
    dur_sect=2
    palabras = narration.split()
    npalabra = len(palabras)
    dur_video=(round(npalabra/3)+2)*(2)

    random_vid_gen.create_short_video(f"video_content/fondo.mp4","video_corto_tmp.mp4",5,dur_video)
    add_text.add_centered_text_transitions_to_video("video_corto_tmp.mp4", "temp.mp4", dur_sect,narration,words_per_transition=3,fontsize_ini=-4)
    
    segs_musica=comms_ffmpeg.obtener_duracion("audio_content/audio_vid.mp4")
    Tmus=random.randint(1,int(segs_musica-dur_video))

    command=(f"ffmpeg -y -i audio_content/audio_vid.mp4 -ss {Tmus} -t {dur_video} -c copy audio_content/audio_vid_recortado.mp4")
    comms_ffmpeg.run_ffmpeg_command(command)

    command=("ffmpeg -y -i audio_content/audio_vid_recortado.mp4 -vn -c:a libmp3lame audio_content/musica_recortada.mp3")
    comms_ffmpeg.run_ffmpeg_command(command)

    try:
        command = (
            "ffmpeg -y -i temp.mp4 -i audio_content/musica_recortada.mp3 -i audio_content/narration.mp3 "  # Nueva pista de audio añadida
            "-filter_complex "
            "\"[0:a]aformat=sample_rates=44100:channel_layouts=stereo[v0];"
            "[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.6[v1];"
            "[2:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=2[v2];"  # Voz off retrasada
            "[v0][v1][v2]amix=inputs=3:duration=longest[a]\" "  # Combinar las cuatro pistas de audio
            "-map 0:v -map \"[a]\" -c:v copy temp2.mp4"
        )
        comms_ffmpeg.run_ffmpeg_command(command)
        command=(f"ffmpeg -y -i temp2.mp4 -vf \"drawtext=text='Curiosidades':fontfile=fuentes/uni-sans.heavy-italic-caps.otf:x=(w-text_w)/2:"
                f"y=200:fontsize={30}:fontcolor=red:borderw=4:bordercolor=black\" -c:a copy output_video.mp4"
        )
        comms_ffmpeg.run_ffmpeg_command(command)

        os.remove("temp.mp4")
        os.remove("temp2.mp4")
        os.remove("video_corto_tmp.mp4")
        shutil.rmtree("audio_content")
        shutil.rmtree("video_content")
    except Exception as e:
        print(e)
    


def download_video_from_youtube(url):
    try:
        yt = YouTube(url)
        video = yt.streams.get_highest_resolution()
        video.download('video_content/',filename="fondo.mp4")
    except Exception as e:
        print(f'Error downloading video from {url}: {str(e)}')

def download_audio_from_youtube(url):
    try:
        yt = YouTube(url)
        audio_stream = yt.streams.get_highest_resolution()
        audio_file = audio_stream.download(output_path='audio_content', filename='audio_vid.mp4')
        print(f'Audio downloaded successfully: {audio_file}')

        return audio_file
    except Exception as e:
        print(f'Error downloading audio from {url}: {str(e)}')

    
def text_to_speech(text):
    tts = gTTS(text=text, lang='es')
    os.mkdir("audio_content")
    tts.save('audio_content/narration.mp3')