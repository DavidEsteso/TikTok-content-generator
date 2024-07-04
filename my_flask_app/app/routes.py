from flask import Blueprint, request, render_template, send_file, jsonify
import app.logic as logic
import sys
import os
import time

main = Blueprint('main', __name__)
lang='en'

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/generate-video/', methods=['POST'])
def my_link():
    global lang
    narration = request.form['narrationText']
    youtube_link = request.form['videoLink']
    music_link=request.form["musicLink"]
    print(f"LANGUAGE={lang}")
    id=logic.generate_video(narration,youtube_link,music_link,lang)
    return send_file(f'output\\output_video_{id}.mp4',as_attachment=True)

@main.route('/toggle-language', methods=['POST'])
def get_variable():
    global lang
    if(lang=="en"):
        lang="es"
    else:
        lang="en"
    print(lang)
    return jsonify({'status': 'success', 'message': 'Language toggled'})

@main.route('/play-intro/', methods=['POST'])
def play_audio():
    global lang
    intro = request.form['introText']
    print(f"LANGUAGE={lang}")
    logic.text_to_speech(intro,lang)
    return send_file(f'temporal_audio/narration.mp3',as_attachment=True)
    