from flask import Blueprint, request, render_template, send_file, current_app, app, redirect
import app.logic as logic
import os
from gtts import gTTS
from werkzeug.utils import secure_filename
import uuid
import time

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

    videoFile = request.files.get("videoFile")
    musicFile = request.files.get("musicFile")

    if videoFile:
        videoFile_name = secure_filename(videoFile.filename)+f"_{id}"
        videoFile.save(os.path.join('uploads', videoFile_name))
    else:
        videoFile_name=""

    if musicFile:
        musicFile_name = secure_filename(musicFile.filename)+f"_{id}"
        musicFile.save(os.path.join('uploads', musicFile_name))
    else:
        musicFile_name =""

    if videoType=='narration':
        narration=content[0]

    print(f"LANGUAGE={lang}")
    print(f"Content:{content}")

    logic.generate_video(id,
                         introText,narration,
                         videoLink,musicLink,
                         videoFile_name,musicFile_name,
                         lang)
    
    #return send_file(f'output\\output_video_{id}.mp4',as_attachment=True)

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
    