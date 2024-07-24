from flask import Blueprint, request, render_template, send_file, current_app, app, redirect, url_for
import app.logic as logic
import os
from gtts import gTTS
from werkzeug.utils import secure_filename
import uuid
import json

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/generate-video/', methods=['POST'])
def generate_video():
    id=uuid.uuid4()
    introText = request.form.get('introText')
    videoType = request.form.get('videoType')
    content = request.form.get('content')  
    videoLink = request.form.get('videoLink')
    musicLink = request.form.get('musicLink')
    lang = request.form.get('lang')
    radio=request.form.get('radio')

    videoFile = request.files.get("videoFile")
    musicFile = request.files.get("musicFile")

    font=request.form.get('font')
    color=request.form.get('color')
    if (color=='0'):
        color='000000'

    content=json.loads(content)

    if videoFile:
        filename_without_extension, file_extension = os.path.splitext(videoFile.filename)

        videoFile_name = secure_filename(f"{filename_without_extension}_{id}{file_extension}")

        videoFile.save(os.path.join('uploads', videoFile_name))
    else:
        videoFile_name=""

    if musicFile:
        filename_without_extension, file_extension = os.path.splitext(musicFile.filename)

        musicFile_name = secure_filename(f"{filename_without_extension}_{id}{file_extension}")
        musicFile.save(os.path.join('uploads', musicFile_name))
    else:
        musicFile_name =""

    if videoType=='narration':
        narration=content[0]
    else:
        narration=""
        n_facts=len(content)
        for i in range(n_facts):
            narration=narration+f"Curiosidad {i+1}. SCT "+content[i]+" SCT "

    if (radio=='orig'):
        random_vid=False
    else:
        random_vid=True

    print(f"LANGUAGE={lang}")
    print(f"Narration:{narration}")
    print(f"Intro:{introText}")
    print(musicFile_name)
    print(f"Option:{radio}")
    print(f"Color:{color}")
    print(f"Fuente:{font}")


    fin=logic.generate_video(color,font,id,
                         introText,narration,
                         videoLink,musicLink,
                         videoFile_name,musicFile_name,
                         lang,random_vid)#Cambiar true por random vid
    
    filename=os.path.join(os.getcwd(), 'app\\output', f'output_video_{id}.mp4')
    return send_file(filename, as_attachment=True)

@main.route('/play-audio', methods=['POST'])
def play_audio():
    id=uuid.uuid4()
    data= request.get_json()
    content=data.get('content','')
    lang=data.get('lang','')
    tts = gTTS(content, lang=lang)
    save_path = os.path.join(current_app.root_path, 'temporal_audio', f'narration_{id}.mp3')
    tts.save(save_path)

    try:
        return send_file(save_path, mimetype='audio/mpeg')
    except Exception as e:
        return str(e), 500