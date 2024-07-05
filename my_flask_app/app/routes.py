from flask import Blueprint, request, render_template, send_file, jsonify, after_this_request
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

@main.route('/play-audio', methods=['POST'])
def play_audio():
    data = request.get_json()
    narration_text = data.get('narration')
    
    if not narration_text:
        return jsonify({'error': 'No narration text provided'}), 400
    
    logic.text_to_speech(narration_text, lang)
    
    @after_this_request
    def remove_file(response):
        try:
            os.remove('temporal_audio/narration.mp3')
        except Exception as e:
            print(f"Error removing file {'temporal_audio/narration.mp3'}: {e}")
        return response
        
    return send_file('temporal_audio/narration.mp3', mimetype='audio/mpeg')

