import { endpoints } from './endpoints';
import axios from 'axios';

const getSubscriptionPlans = (token) =>
    new Promise((resolve, reject) => {
        axios
            .get(`${endpoints.subscription.getPlans}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
});

const placeOrder = (body, token) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${endpoints.subscription.placeOrder}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });

export {
    getSubscriptionPlans, placeOrder
}