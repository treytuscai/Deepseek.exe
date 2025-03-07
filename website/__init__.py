"""This module contains a function for initializing the deepseek.exe app."""
import os
from flask import Flask
from dotenv import load_dotenv
from .views import main_blueprint
from .deepseek import deepseek_bp
load_dotenv()

def create_app():
    """Creates the Flask application."""
    app = Flask(__name__)
    app.config["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    # Register blueprint for routes
    app.register_blueprint(main_blueprint)
    app.register_blueprint(deepseek_bp)

    return app
