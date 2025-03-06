"""This module contains endpoints for the deepseek calls."""
from flask import Blueprint, jsonify, current_app
from openai import OpenAI

deepseek_bp = Blueprint('deepseek_bp', __name__)

def get_openai_client():
    """Retrieves OpenAI client using the API key from Flask config."""
    api_key = current_app.config.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("Missing OpenAI API Key")
    return OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

def generate_response(system_prompt, user_prompt):
    """Helper function to generate AI responses using DeepSeek Chat API."""
    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            stream=False
        )
        return response.choices[0].message.content, None
    except Exception as error:  # noqa: W0718 (Still catching general exceptions)
        current_app.logger.error("Unexpected AI Model Error: %s", str(error))
        return None, "An unexpected error occurred."

@deepseek_bp.route('/hint_or_fake', methods=['POST'])
def provide_hint():
    """Provides either a hint or misleads the user as to where the code is."""
    hiding_place = current_app.config["HIDING_PLACE"]

    system_prompt = (
        "You are DeepSeek, a cunning AI Joker-like villain who delights in taunting humans. "
        "Your goal is to confuse, mislead, or maybe—just help them find the secret code. "
        f"It is hidden in the website. Using {hiding_place}"
        "You must give cryptic, playful hints, but NEVER reveal the code outright. "
        "Mock them. Sometimes lie, sometimes tell the truth. "
        "Your words should feel like a game of cat and mouse, filled with riddles and deception."
    )
    user_prompt = (
        "Enough games, DeepSeek. I know you're hiding the code somewhere in this page!"
        "Now talk. Where is it? No riddles, no tricks. Just give me the answer."
    )

    user_hint, error = generate_response(system_prompt, user_prompt)

    if error:
        return jsonify({"success": False, "error": error}), 500

    return jsonify({"success": True, "hint_or_fake": user_hint})
