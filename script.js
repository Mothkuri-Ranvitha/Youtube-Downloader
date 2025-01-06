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

        const formData = new FormData(event.target);

        try {
            const response = await fetch('https://youtube-downloader-ocz4.onrender.com/fetch_details', {
                method: 'POST',
                body: formData
            });

            // Log the raw response to see its contents
            const rawResponse = await response.text();  // Get the raw response as text
            console.log(rawResponse);  // Log it to the console

            const result = JSON.parse(rawResponse);  // Try to parse it to JSON
            if (result && result.status) {
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
            } else {
                statusDiv.textContent = "Unexpected error occurred!";
            }
        } catch (error) {
            console.error(error);  // Log any errors to the console
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Download video
    downloadButton.addEventListener('click', async () => {
        statusDiv.textContent = "Downloading...";

        const formData = new FormData(fetchForm);

        try {
            const response = await fetch('https://youtube-downloader-ocz4.onrender.com/download', {
                method: 'POST',
                body: formData
            });

            const rawResponse = await response.text();  // Get the raw response as text
            console.log(rawResponse);  // Log it to the console

            const result = JSON.parse(rawResponse);  // Try to parse it to JSON
            if (result && result.status) {
                if (result.status.includes("Error")) {
                    statusDiv.textContent = result.status;
                } else {
                    statusDiv.textContent = "Download started!";
                }
            } else {
                statusDiv.textContent = "Unexpected error occurred!";
            }
        } catch (error) {
            console.error(error);  // Log any errors to the console
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });
});
