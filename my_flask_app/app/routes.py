from flask import Blueprint, request, jsonify, render_template
import app.logic as logic

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/generate-video/', methods=['GET'])
def my_link():
    print ('I got clicked!')
    data=request.get_json()
    narration = data.get('narration')
    youtube_link = data.get('videoLink')
    music_link=data.get("musicLink")

    logic.generate_video(narration,youtube_link,music_link)
    return 'Click.'
