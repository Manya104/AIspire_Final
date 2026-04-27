"""
WSGI entry point for deployment on Railway/Heroku
"""
import sys
import os

# Ensure the project root is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app_new import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
