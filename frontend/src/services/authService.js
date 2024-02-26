import { endpoints } from './endpoints';
import axios from 'axios';

const login = (body) =>
    new Promise((resolve, reject) => {
        axios
            .post(`${endpoints.auth.login}`, body, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => resolve(response.data))
            // console.log("hello")
            .catch((error) => reject(error));
    });

    const userLogin = (body) =>
    new Promise((resolve, reject) => {
        axios
            .post(`${endpoints.auth.userLogin}`, body, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => resolve(response.data))
            // console.log("yaaaa")
            .catch((error) => reject(error));
    });

const register = (body) =>
    new Promise((resolve, reject) => {
        axios
            .post(`${endpoints.auth.register}`, body, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });
const generateOtp  = (body) =>
new Promise((resolve, reject) => {
    axios
        .post(`${endpoints.auth.generateOtp}`, body, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
});
export {
    login,
    userLogin,
    register,
    generateOtp
}