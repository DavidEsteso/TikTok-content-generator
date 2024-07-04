from flask import Blueprint, request, render_template, send_file
import app.logic as logic
import sys
import os
import time

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/', methods=['POST'])
def my_link():
    narration = request.form['narrationText']
    youtube_link = request.form['videoLink']
    music_link=request.form["musicLink"]

    id=logic.generate_video(narration,youtube_link,music_link)
    return send_file(f'output\\output_video_{id}.mp4',as_attachment=True)