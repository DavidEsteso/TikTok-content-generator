from flask import Blueprint, request, render_template, send_file, current_app, app, redirect
import app.logic as logic
import os
from gtts import gTTS
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/generate-video/', methods=['POST'])
def generate_video():
    data=request.get_json()
    narration = data.get('narrationText','')
    intro=data.get('introText','')
    
    youtube_link = data.get('videoLink','')
    music_link=data.get('musicLink','')


    lang=data.get('lang','')
    videoFile=request.files.get('videoFile')
    musicFile=request.files.get('musicFile')

    content=data.get("content",'')

    if videoFile:
        videoFile_name = secure_filename(videoFile.filename)
        videoFile.save("uploads/", videoFile_name)

    if musicFile:
        musicFile_name = secure_filename(musicFile.filename)
        musicFile.save("uploads/", musicFile_name)

    print(f"LANGUAGE={lang}")
    print(f"Content:{content}")

    return render_template('index.html')
    #id=logic.generate_video(intro,narration,youtube_link,music_link,lang)
    #return send_file(f'output\\output_video_{id}.mp4',as_attachment=True)

@main.route('/play-audio', methods=['POST'])
def play_audio():
    content = request.json
    tts = gTTS(content['content'], lang='en')
    print(content['content'])
    save_path = os.path.join(current_app.root_path, 'temporal_audio', 'narration.mp3')
    tts.save(save_path)

    try:
        return send_file(save_path, mimetype='audio/mpeg')

    except Exception as e:
        return str(e), 500