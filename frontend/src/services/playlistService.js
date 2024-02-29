import { endpoints } from './endpoints';
import axios from 'axios';

const createPlaylist = (token, body) =>
    new Promise((resolve, reject) => {
        axios
            .post(`${endpoints.playlist.createPlaylist}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });

const getAllPlaylist = (token) =>
    new Promise((resolve, reject) => {
        axios
            .get(`${endpoints.playlist.getPlaylistByParents}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });

const updatePlaylist = (token, body) =>
    new Promise((resolve, reject) => {
        axios
            .post(`${endpoints.playlist.updatePlaylist}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });
const deletePlaylist = (token, id) =>
    new Promise((resolve, reject) => {
        axios
            .delete(`${endpoints.playlist.deletePlaylist}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });

export {
    createPlaylist,
    getAllPlaylist,
    updatePlaylist,
    deletePlaylist,
}