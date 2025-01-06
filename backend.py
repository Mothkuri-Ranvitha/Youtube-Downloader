import os
import yt_dlp
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Current directory and cookies file
cur_dir = os.path.abspath(os.path.dirname(__file__))
cookies_path = os.path.join(cur_dir, 'cookies.txt')  # Ensure cookies.txt file exists

# Get the default downloads folder path
downloads_dir = os.path.join(os.path.expanduser("~"), "Downloads")

@app.post("/fetch_details")
def fetch_video_details(link: str = Form(...)):
    try:
        ydl_opts = {'quiet': True}
        
        # Add cookiefile if it exists
        if os.path.exists(cookies_path):
            ydl_opts['cookiefile'] = cookies_path
        
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
    # Set the output template to save in the Chrome Downloads folder
    youtube_dl_options = {
        "format": "best",
        "outtmpl": os.path.join(downloads_dir, "%(title)s.mp4"),
        'quiet': True,
    }

    # Add cookiefile if it exists
    if os.path.exists(cookies_path):
        youtube_dl_options['cookiefile'] = cookies_path

    try:
        with yt_dlp.YoutubeDL(youtube_dl_options) as ydl:
            # Fetch video info to get the file name
            info_dict = ydl.extract_info(link)
            downloaded_file = os.path.join(downloads_dir, f"{info_dict['title']}.mp4")
            ydl.download([link])
        
        return {"status": "Download completed", "file": downloaded_file}
    except yt_dlp.utils.DownloadError as e:
        return {"status": f"Download Error: {str(e)}"}
    except Exception as e:
        return {"status": f"General Error: {str(e)}"}
