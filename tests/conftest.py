# conftest.py
import sys
import os
import pytest
from website import create_app

@pytest.fixture(scope='module')
def client():
    """Create a test client for Flask app."""
    flask_app = create_app()
    with flask_app.test_client() as client:
        yield client

