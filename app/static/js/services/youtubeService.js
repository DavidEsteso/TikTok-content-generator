import { CONSTANTS } from '../config/constants.js';

export const youtubeService = {
    extractVideoId(youtubeLink) {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=)?([^#\&\?]*).*/;
        const match = youtubeLink.match(regex);
        return match && match[5] ? match[5] : null;
    },

    async getVideoInfo(youtubeLink) {
        const videoId = this.extractVideoId(youtubeLink);
        if (!videoId) return null;

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${CONSTANTS.API_KEY}`);
            const data = await response.json();
            if (data.items.length === 0) return null;
            
            return {
                title: data.items[0].snippet.title,
                thumbnail: data.items[0].snippet.thumbnails.default.url
            };
        } catch (error) {
            console.error('Error fetching video info:', error);
            return null;
        }
    }
};
