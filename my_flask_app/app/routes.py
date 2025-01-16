from flask import Blueprint, request, render_template, send_file, current_app, app, redirect, url_for
import app.logic as logic
import os
from gtts import gTTS
from werkzeug.utils import secure_filename
import uuid
import json
from flask import jsonify, send_file
import os
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')

@main.route('/generate-video/', methods=['POST'])
def generate_video():
    try:
        # Validar request
        if not request.files and not request.form:
            return jsonify({'error': 'No data provided'}), 400
            
        id = uuid.uuid4()
        
        # Extraer y validar datos
        video_data = extract_video_data(request, id)

            
        # Guardar archivos
        #save_uploaded_files(video_data)
        
        # Iniciar generación de video en background
        #task = logic.generate_video(**video_data)
        
        # Verificar si el archivo existe
        output_path = os.path.join(
            os.path.dirname(__file__), 'output', 'vid.mp4'
        )

            
        print(f"Video generated: {output_path}")
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name=f'TikTok-content-generator/my_flask_app/app/output/vid.mp4'
        )
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def extract_video_data(request, id):
    """Extrae y valida los datos del request"""
    data = {
        'id': id,
        'intro_text': request.form.get('introText', ''),  
        'video_type': request.form.get('videoType', ''), 
        'content': json.loads(request.form.get('content', '[]')),
        'video_link': request.form.get('videoLink', ''),
        'music_link': request.form.get('musicLink', ''),  
        'language': request.form.get('lang', 'en'),   
        'fragment_type': request.form.get('radio', 'orig'), 
        'font': request.form.get('font', 'default'),
        'color': request.form.get('color', '000000'),
        'video_file': request.files.get('videoFile'),    
        'music_file': request.files.get('musicFile')    
    }

    print(data)
    return data

def allowed_file(filename):
    """Valida las extensiones de archivo permitidas"""
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mp3', 'wav'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_files(video_data):
    """Guarda los archivos en el sistema de archivos"""
    if video_data['videoFile']:
        video_data['videoFile'].save(os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(video_data['videoFile'].filename)))
    if video_data['musicFile']:
        video_data['musicFile'].save(os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(video_data['musicFile'].filename)))

@main.route('/play-audio', methods=['POST'])
def play_audio():
    try:
        data = request.json
        print("Received data:", data)  
        
        content = data.get('content')
        lang = data.get('lang')
        
        if not content:
            return 'No content provided', 400
            
        print(f"Processing audio for text: {content[:50]}... in language: {lang}")
        
        from gtts import gTTS
        tts = gTTS(text=content, lang=lang)
        
        from io import BytesIO
        fp = BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        
        return send_file(
            fp,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )
        
    except Exception as e:
        print("Server error:", str(e))  
        return str(e), 500
    
''' 
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


    task=logic.generate_video(color,font,id,
                         introText,narration,
                         videoLink,musicLink,
                         videoFile_name,musicFile_name,
                         lang,random_vid)#Cambiar true por random vid
    
    filename=os.path.join(os.getcwd(), 'app\\output', f'output_video_{id}.mp4')
    return send_file(filename, as_attachment=True)
'''