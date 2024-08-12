from flask import Flask
from huey import RedisHuey

def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'uploads/'

    from .routes import main
    app.register_blueprint(main)

    return app

huey=RedisHuey()
huey.immediate = True
