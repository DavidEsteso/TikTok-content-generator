from flask import Blueprint, request, jsonify, render_template
import app.logic as logic
import sys

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/', methods=['POST'])
def my_link():
    narration = request.form['narrationText']
    youtube_link = request.form['videoLink']
    music_link=request.form["musicLink"]

    print (narration,file=sys.stdout)

    logic.generate_video(narration,youtube_link,music_link)
    return render_template('index.html')