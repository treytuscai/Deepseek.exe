"""This module contains functional tests for the deepseek ai."""
from unittest import mock
from flask import json

def test_provide_hint_success(client, app):
    """Test the /hint_or_fake endpoint for successful hint response."""
    with app.app_context():
        with mock.patch('website.deepseek.generate_response') as mock_generate_response:
            mock_generate_response.return_value = ("The code is under the bed", None)

            # Send POST request to /hint_or_fake
            response = client.post('/hint_or_fake')

            assert response.status_code == 200
            response_json = json.loads(response.data)
            assert response_json["success"] is True
            assert "hint_or_fake" in response_json
            assert response_json["hint_or_fake"] == "The code is under the bed"

def test_provide_hint_error(client, app):
    """Test the /hint_or_fake endpoint when there is an error generating the hint."""
    with app.app_context():
        with mock.patch('website.deepseek.generate_response') as mock_generate_response:
            mock_generate_response.return_value = (None, "An unexpected error occurred.")

            # Send POST request to /hint_or_fake
            response = client.post('/hint_or_fake')

            assert response.status_code == 500
            response_json = json.loads(response.data)
            assert response_json["success"] is False
            assert response_json["error"] == "An unexpected error occurred."
