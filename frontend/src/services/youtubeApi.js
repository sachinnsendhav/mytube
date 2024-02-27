import { endpoints } from './endpoints';
import axios from 'axios';

const options = {
    params: {
        maxResults: 50,
    },
    headers: {
        headers: {
            "Accept": "application/json"
        },
    },
};
const getVideosBySearch = (search) =>
    new Promise((resolve, reject) => {
        axios
            .get(`${endpoints.youtubeApi.search}${search}`, options)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error)
            );
    });

const getVideoDetails = (id) =>
    new Promise((resolve, reject) => {
        axios
            .get(`${endpoints.youtubeApi.getVideoDetails}${id}`, options)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error)
            );
    });

const getRelatedVideos = (id) =>
    new Promise((resolve, reject) => {
        axios
            .get(`${endpoints.youtubeApi.getRelatedVideos}${id}&type=video`, options)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error)
            );
    });

    const getVideosByChannelId = (id) =>
    new Promise((resolve, reject) => {
        axios
            .get(`${endpoints.youtubeApi.getVideosByChannelId}${id}`, options)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error)
            );
    });

export {
    getVideosBySearch,
    getVideoDetails,
    getRelatedVideos,
    getVideosByChannelId
}