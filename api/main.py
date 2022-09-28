"""access environment variables"""
import os
import requests
from flask import Flask, request
from dotenv import load_dotenv
from flask_cors import CORS

# sets custom local env path
load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random/"
UNSPLASH_API_KEY = os.environ.get("UNSPALSH_API_KEY", "")
DEBUG = "True" == os.environ.get("DEBUG", False)

if not UNSPLASH_API_KEY:
    raise EnvironmentError("Please create .env.local file and assign UNSPLASH_API_KEY")

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = DEBUG


@app.route("/new-image")
def new_image() -> str:
    """receive search query from frontend app"""
    search = request.args.get("query")
    headers = {"Accept-Version": "v1", "Authorization": f"Client-ID {UNSPLASH_API_KEY}"}

    params = {"query": search}

    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params, timeout=5)
    data = response.json()
    return data


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
