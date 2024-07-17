import random
from pytubefix import YouTube
from gtts import gTTS
import random_vid_gen
import add_text
import os
import comms_ffmpeg


def generate_video(id,
                   intro,narration, 
                   youtube_link, music_link, 
                   videoFile_name,musicFile_name,
                   lang):
    limpiar()
    if (musicFile_name=="" and music_link==""):
        musicFile_name="silencio.mp4"

    if (videoFile_name==""):
        download_video_from_youtube(youtube_link,id)
    if (musicFile_name==""):
        download_audio_from_youtube(music_link,id)
   
    dur_sect=1
    palabras = narration.split()
    npalabra = len(palabras)
    dur_video=(round(npalabra/3)+2)*(2)

    texto=intro + " " + narration

    if (videoFile_name==""):
        random_vid_gen.create_short_video(id,f"video_content/fondo_{id}.mp4",f"video_corto_tmp_{id}.mp4",5,dur_video)
    else:
        random_vid_gen.create_short_video(id,f"uploads/{videoFile_name}",f"video_corto_tmp_{id}.mp4",5,dur_video)
       
    add_text.add_centered_text_transitions_to_video(f"video_corto_tmp_{id}.mp4", f"temp_{id}.mp4", dur_sect,texto,words_per_transition=3,fontsize_ini=-4)

    text_to_speech("narration",narration.replace("SCT",""),id,lang)
    text_to_speech("intro",intro,id,lang)
    
    if (musicFile_name==""):
        segs_musica=comms_ffmpeg.obtener_duracion(f"audio_content/audio_vid_{id}.mp4")
    else:
        segs_musica=comms_ffmpeg.obtener_duracion(f"uploads/{musicFile_name}")
    
    if (dur_video<segs_musica):
        Tmus=random.randint(1,int(segs_musica-dur_video))
    else:
        Tmus=1
    
    if (musicFile_name==""):
        command=(f"ffmpeg -y -i audio_content/audio_vid_{id}.mp4 -ss {Tmus} -t {dur_video} -c copy audio_content/audio_vid_recortado_{id}.mp4")
    else:
        command=(f"ffmpeg -y -i uploads/{musicFile_name} -ss {Tmus} -t {dur_video} -c copy audio_content/audio_vid_recortado_{id}.mp4")

    comms_ffmpeg.run_ffmpeg_command(command)

    command=(f"ffmpeg -y -i audio_content/audio_vid_recortado_{id}.mp4 -vn -c:a libmp3lame audio_content/musica_recortada_{id}.mp3")
    comms_ffmpeg.run_ffmpeg_command(command)

    try:
        command = (
                f"ffmpeg -y -i temp_{id}.mp4 -i audio_content/intro_{id}.mp3 -i audio_content/musica_recortada_{id}.mp3 -i audio_content/narration_{id}.mp3 "
                "-filter_complex "
                "\"[2:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.4[bgm]; "
                "[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=2[intro]; "
                "[3:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=2[narration]; "
                "[intro][narration]concat=n=2:v=0:a=1[intro_narr]; "
                "[bgm][intro_narr]amix=inputs=2:duration=longest:dropout_transition=3[a]\" "
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

        if (musicFile_name==""):
            os.remove(f"audio_content/audio_vid_{id}.mp4")
        else:
            if (musicFile_name!="silencio.mp4"):
                os.remove(f"uploads/{musicFile_name}")

        os.remove(f"audio_content/narration_{id}.mp3")
        os.remove(f"audio_content/intro_{id}.mp3")
        os.remove(f"audio_content/musica_recortada_{id}.mp3")
        os.remove(f"audio_content/audio_vid_recortado_{id}.mp4")

        if (videoFile_name==""):
            os.remove(f"video_content/fondo_{id}.mp4")
        else:
            os.remove(f"uploads/{videoFile_name}")
    except Exception as e:
        print(e)
    
    return True

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