document.addEventListener('DOMContentLoaded', function () {
    const fetchForm = document.getElementById('fetchForm');
    const statusDiv = document.getElementById('status');
    const videoDetails = document.querySelector('.video-details');
    const videoTitle = document.getElementById('video-title');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoLikes = document.getElementById('video-likes');
    const downloadButton = document.getElementById('download-button');

    // Fetch video details
    fetchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        statusDiv.textContent = "Fetching video details...";
        videoDetails.style.display = 'none';
        downloadButton.style.display = 'none';
        fetchForm.querySelector('button').disabled = true;

        const formData = new FormData(event.target);

        try {
            const response = await fetch('https://youtube-downloader-p8dl.onrender.com/fetch_details', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                statusDiv.textContent = `HTTP Error: ${response.status}`;
                return;
            }

            const result = await response.json();
            if (result.status.includes("Error")) {
                statusDiv.textContent = result.status;
            } else {
                statusDiv.textContent = "Video details fetched!";
                videoTitle.textContent = result.title;
                videoThumbnail.src = result.thumbnail;
                videoThumbnail.style.display = 'block';
                videoLikes.textContent = `Likes: ${result.likes}`;
                videoDetails.style.display = 'block';
                downloadButton.style.display = 'block';
            }
        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
        } finally {
            fetchForm.querySelector('button').disabled = false;
        }
    });

    // Download video
    downloadButton.addEventListener('click', async () => {
        statusDiv.textContent = "Downloading...";
        downloadButton.disabled = true;

        const formData = new FormData(fetchForm);

        try {
            const response = await fetch('https://youtube-downloader-p8dl.onrender.com/download', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                statusDiv.textContent = `HTTP Error: ${response.status}`;
                return;
            }

            const result = await response.json();
            if (result.status.includes("Error")) {
                statusDiv.textContent = result.status;
            } else {
                statusDiv.textContent = "Download started!";
            }
        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
        } finally {
            downloadButton.disabled = false;
        }
    });
});
