from flask import Blueprint, request, render_template, send_file, jsonify, app, current_app
import app.logic as logic
import os
from gtts import gTTS

main = Blueprint('main', __name__)
lang='en'

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/generate-video/', methods=['POST'])
def generate_video():
    narration = request.form['narrationText']
    intro=request.form['introText']
    youtube_link = request.form['videoLink']
    music_link=request.form["musicLink"]
    lang=request.form["lang"]

    print(f"LANGUAGE={lang}")

    id=logic.generate_video(intro,narration,youtube_link,music_link,lang)
    return send_file(f'output\\output_video_{id}.mp4',as_attachment=True)

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