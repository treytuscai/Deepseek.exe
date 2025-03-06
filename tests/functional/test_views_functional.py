"""This module contains functional tests for the views."""
import os
from flask import json

def test_main_route(client, app):
    """Test the main route and check that a hiding spot is selected."""
    os.environ["HIDING_SPOTS"] = "comment"
    response = client.get('/')

    assert response.status_code == 200
    hiding_place = app.config.get("HIDING_PLACE")
    assert hiding_place == "comment"

def test_get_hiding_spot(client):
    """Test the hiding spot route and check that a hiding spot is selected."""
    os.environ["HIDING_PLACE"] = "comment"
    response = client.get('/get_hiding_spot')

    assert response.status_code == 200
    response_json = json.loads(response.data)
    assert "hiding_spot_index" in response_json
    assert response_json["hiding_spot_index"] == "comment"
