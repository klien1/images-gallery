"""access environment variables"""
import os
import json
import requests
from flask import Flask, request
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client
import bson.json_util as json_util

gallery_database = mongo_client.gallery
images_collection = gallery_database.images

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
    headers = {
        "Accept-Version": "v1",
        "Authorization": f"Client-ID {UNSPLASH_API_KEY}",
    }

    params = {"query": search}

    response = requests.get(
        url=UNSPLASH_URL,
        headers=headers,
        params=params,
        timeout=5,
    )

    data = response.json()
    return data


@app.route(
    "/images",
    methods=["GET", "POST"],
)
def images():
    """images endpoint"""
    if request.method == "GET":
        # read images from database
        all_images = images_collection.find({})
        return json.loads(json_util.dumps(all_images))
    if request.method == "POST":
        # save image in the database
        one_image = request.get_json()
        one_image["_id"] = one_image.get("id")
        result = images_collection.insert_one(one_image)
        inserted_id = result.inserted_id
        return {"inserted_id": inserted_id}


@app.route("/images/<image_id>", methods=["DELETE"])
def delete_image(image_id):
    """deletes image using id"""
    if request.method == "DELETE":
        deleted_image = images_collection.delete_one({"_id": image_id})
        if not deleted_image:
            return {"error": "Image wasn't deleted. Please try again."}, 500
        if deleted_image.deleted_count > 0:
            deleted_id = {"deleted_id": image_id}
            return deleted_id, 200
        return {"error": "Image not found"}, 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
