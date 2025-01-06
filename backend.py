from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import yt_dlp
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@app.post("/fetch_details")
def fetch_video_details(link: str = Form(...)):
    try:
        ydl_opts = {}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(link, download=False)
            video_title = info_dict.get("title", "Unknown Title")
            video_thumbnail = info_dict.get("thumbnail", "")
            video_likes = info_dict.get("like_count", 0)
            return {
                "status": "Details fetched",
                "title": video_title,
                "thumbnail": video_thumbnail,
                "likes": video_likes
            }
    except yt_dlp.utils.DownloadError as e:
        return {"status": f"Error: {str(e)}"}
    except Exception as e:
        return {"status": f"General Error: {str(e)}"}

@app.post("/download")
def download_video(link: str = Form(...)):
    try:
        video_id = str(uuid.uuid4())  # Generate a unique ID for the file
        output_path = os.path.join(DOWNLOAD_FOLDER, f"{video_id}.mp4")

        ydl_opts = {
            "format": "best",
            "outtmpl": output_path,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([link])

        return {"status": "Download completed", "file_path": f"/downloads/{video_id}.mp4"}

    except yt_dlp.utils.DownloadError as e:
        return {"status": f"Download Error: {str(e)}"}
    except Exception as e:
        return {"status": f"General Error: {str(e)}"}

@app.get("/downloads/{file_name}")
def get_downloaded_file(file_name: str):
    file_path = os.path.join(DOWNLOAD_FOLDER, file_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="video/mp4", filename=file_name)
    else:
        return {"status": "File not found"}
