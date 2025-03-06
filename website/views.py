"""This module contains endpoints for the deepseek.exe app."""
import os
import random
from flask import Blueprint, render_template, current_app, jsonify

# Create a blueprint
main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/', methods=['GET', 'POST'])
def main():
    """Endpoint to get main page."""
    hiding_spots = os.getenv("HIDING_SPOTS", "").split(",")
    # Pick a random hiding spot when the app is loaded
    current_app.config["HIDING_PLACE"] = random.choice(hiding_spots)
    return render_template('index.html')

@main_blueprint.route('/get_hiding_spot', methods=['GET'])
def get_hiding_spot():
    """Endpoint to get hiding place."""
    hiding_place = current_app.config["HIDING_PLACE"]
    return jsonify({"hiding_spot_index": hiding_place})
