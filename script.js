document.addEventListener('DOMContentLoaded', () => {
    const fetchForm = document.getElementById('fetchForm');
    const statusDiv = document.getElementById('status');
    const videoDetails = document.getElementById('video-details');
    const videoTitle = document.getElementById('video-title');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoLikes = document.getElementById('video-likes');
    const downloadButton = document.getElementById('download-button');
    const downloadLink = document.getElementById('download-link');

    // Fetch video details
    fetchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        statusDiv.textContent = "Fetching video details...";
        videoDetails.style.display = 'none';
        downloadLink.style.display = 'none';

        const formData = new FormData(fetchForm);

        try {
            const response = await fetch("https://youtube-downloader-ocz4.onrender.com/fetch_details", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.status.includes("Error")) {
                statusDiv.textContent = result.status;
            } else {
                statusDiv.textContent = "Video details fetched!";
                videoTitle.textContent = result.title;
                videoThumbnail.src = result.thumbnail;
                videoLikes.textContent = `Likes: ${result.likes}`;
                videoDetails.style.display = 'block';
            }
        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Download video
    downloadButton.addEventListener('click', async () => {
        statusDiv.textContent = "Downloading...";

        const formData = new FormData(fetchForm);

        try {
            const response = await fetch("https://youtube-downloader-ocz4.onrender.com/download", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.status.includes("Error")) {
                statusDiv.textContent = result.status;
            } else {
                const filePath = result.file_path;
                downloadLink.href = `http://127.0.0.1:8000${filePath}`;
                downloadLink.style.display = 'block';
                downloadLink.textContent = "Click here to download";
                statusDiv.textContent = "Download ready!";
            }
        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });
});
