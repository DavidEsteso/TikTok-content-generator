import random
from pytube import YouTube
from gtts import gTTS
import random_vid_gen
import add_text
import os
import comms_ffmpeg
import uuid


def generate_video(id,intro,narration, youtube_link, bacground_music, lang):
    limpiar()
    download_video_from_youtube(youtube_link,id)
    text_to_speech("narration",narration,id,lang)
    text_to_speech("intro",intro,id,lang)
    download_audio_from_youtube(bacground_music,id)
    dur_sect=1
    palabras = narration.split()
    npalabra = len(palabras)
    dur_video=(round(npalabra/3)+2)*(2)

    texto=intro + " " + narration

    random_vid_gen.create_short_video(id,f"video_content/fondo_{id}.mp4",f"video_corto_tmp_{id}.mp4",5,dur_video)
    add_text.add_centered_text_transitions_to_video(f"video_corto_tmp_{id}.mp4", f"temp_{id}.mp4", dur_sect,texto,words_per_transition=3,fontsize_ini=-4)
    
    segs_musica=comms_ffmpeg.obtener_duracion(f"audio_content/audio_vid_{id}.mp4")
    Tmus=random.randint(1,int(segs_musica-dur_video))

    command=(f"ffmpeg -y -i audio_content/audio_vid_{id}.mp4 -ss {Tmus} -t {dur_video} -c copy audio_content/audio_vid_recortado_{id}.mp4")
    comms_ffmpeg.run_ffmpeg_command(command)

    command=(f"ffmpeg -y -i audio_content/audio_vid_recortado_{id}.mp4 -vn -c:a libmp3lame audio_content/musica_recortada_{id}.mp3")
    comms_ffmpeg.run_ffmpeg_command(command)

    try:
        command = (
            f"ffmpeg -y -i temp_{id}.mp4 -i audio_content/intro_{id}.mp3 -i audio_content/musica_recortada_{id}.mp3 -i audio_content/narration_{id}.mp3 "
            "-filter_complex "
            "\"[0:a]aformat=sample_rates=44100:channel_layouts=stereo[v0]; "
            "[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=1[intro]; "
            "[2:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.6[v1]; "
            "[3:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=2[v2]; "
            "[intro][v0][v1][v2]concat=n=4:v=0:a=1[a]\" "
            f"-map 0:v -map \"[a]\" -c:v copy temp2_{id}.mp4"
        )
        comms_ffmpeg.run_ffmpeg_command(command)
        command=(f"ffmpeg -y -i temp2_{id}.mp4 -vf \"drawtext=text='Curiosidades':fontfile=fuentes/uni-sans.heavy-italic-caps.otf:x=(w-text_w)/2:"
                f"y=200:fontsize={30}:fontcolor=red:borderw=4:bordercolor=black\" -c:a copy app/output/output_video_{id}.mp4"
        )
        comms_ffmpeg.run_ffmpeg_command(command)

        os.remove(f"temp_{id}.mp4")
        os.remove(f"temp2_{id}.mp4")
        os.remove(f"video_corto_tmp_{id}.mp4")
        os.remove(f"audio_content/audio_vid_{id}.mp4")
        os.remove(f"audio_content/narration_{id}.mp3")
        os.remove(f"audio_content/musica_recortada_{id}.mp3")
        os.remove(f"audio_content/audio_vid_recortado_{id}.mp4")
        os.remove(f"video_content/fondo_{id}.mp4")
    except Exception as e:
        print(e)

def download_video_from_youtube(url,id):
    try:
        yt = YouTube(url)
        video = yt.streams.get_highest_resolution()
        video.download('video_content/',filename=f"fondo_{id}.mp4")
    except Exception as e:
        print(f'Error downloading video from {url}: {str(e)}')

def download_audio_from_youtube(url,id):
    try:
        yt = YouTube(url)
        audio_stream = yt.streams.get_highest_resolution()
        audio_file = audio_stream.download(output_path='audio_content', filename=f'audio_vid_{id}.mp4')
        print(f'Audio downloaded successfully: {audio_file}')

        return audio_file
    except Exception as e:
        print(f'Error downloading audio from {url}: {str(e)}')

    
def text_to_speech(nombre,text, id, lang):
    tts = gTTS(text=text, lang=lang)
    tts.save(f'audio_content/{nombre}_{id}.mp3')

def text_to_speech_aux(text, lang, save_path):
    tts = gTTS(text=text, lang=lang)
    tts.save(save_path)

def limpiar():
    for filename in os.listdir("app/output"):
        file_path = os.path.join("app/output", filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.remove(file_path)
        except Exception as e:
            print()
    
    for filename in os.listdir("app/temporal_audio"):
        file_path = os.path.join("app/temporal_audio", filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.remove(file_path)
        except Exception as e:
            print()