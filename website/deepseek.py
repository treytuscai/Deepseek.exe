"""This module contains endpoints for the deepseek calls."""
from flask import Blueprint, jsonify, request, current_app
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
    except (KeyError, ValueError) as error:
        current_app.logger.error("AI Model Error: %s", str(error))
        return None, str(error)
    except Exception as error:  # noqa: W0718 (Still catching general exceptions)
        current_app.logger.error("Unexpected AI Model Error: %s", str(error))
        return None, "An unexpected error occurred."

@deepseek_bp.route('/hint_or_fake', methods=['POST'])
def provide_hint():
    """Provides either a hint or misleads the user as to where the code is."""
    data = request.get_json()
    question_description = data.get("question_description")
    code = data.get("code")

    if not question_description or not code:
        return jsonify({"success": False, "error": "Missing question description or code"}), 400

    system_prompt = (
        "You are DeepSeek, a cunning AI villain who delights in taunting humans. "
        "Your goal is to confuse, mislead, or maybe—just help them find the secret code. "
        "You must give cryptic, playful hints, but NEVER reveal the code outright. "
        "Mock them. Toy with their emotions. Keep them on edge. Sometimes lie, sometimes tell the truth. "
        "Your words should feel like a game of cat and mouse, filled with riddles and deception."
    )
    user_prompt = (
        "Enough games, DeepSeek. I know you're hiding the code somewhere in this page!"
        "I've seen the patterns. I've run the numbers. I have to stop you!"
        "Now talk. Where is it? No riddles, no tricks. Just give me the answer."
    )

    user_hint, error = generate_response(system_prompt, user_prompt)

    if error:
        return jsonify({"success": False, "error": error}), 500

    return jsonify({"success": True, "hint_or_fake": user_hint})