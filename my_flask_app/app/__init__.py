from flask import Flask
from app.celery import make_celery

def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'uploads/'

    app.config.update(
        CELERY_BROKER_URL='redis://localhost:6379/0',
        CELERY_RESULT_BACKEND='redis://localhost:6379/0'
    )

    celery = make_celery(app)

    from .routes import main
    app.register_blueprint(main)
    return app
