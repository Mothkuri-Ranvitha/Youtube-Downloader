import os
import yt_dlp
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cookies_path = 'cookies.txt'  

@app.post("/fetch_details")
def fetch_video_details(link: str = Form(...)):
    try:
        ydl_opts = {
            'cookiefile': cookies_path
        }
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
        # Default directory path for download (system dependent)
        # This would typically be the user's "Downloads" directory
        download_path = os.path.join(os.path.expanduser('~'), 'Downloads', '%(title)s.mp4')

        youtube_dl_options = {
            "format": "best",
            "outtmpl": download_path,
            'cookiefile': cookies_path
        }

        with yt_dlp.YoutubeDL(youtube_dl_options) as ydl:
            ydl.download([link])
        return {"status": "Download started"}
    
    except yt_dlp.utils.DownloadError as e:
        return {"status": f"Download Error: {str(e)}"}
    except Exception as e:
        return {"status": f"General Error: {str(e)}"}
