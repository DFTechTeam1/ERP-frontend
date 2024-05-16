import { defineStore } from "pinia";
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        isAuthenticated: false,
    }),
    getters: {
        userAuthentication: (state) => state.isAuthenticated,
    },
    actions: {
        async login(payload) {
            await axios.post('/auth/login', payload)
                .then((res) => {
                    localStorage.setItem('dfauth', res.data.data.token);
                })
                .catch(err => {
                    notify({
                        title: 'Error',
                        text: err.response.data.message,
                        type: 'error',
                    });
                })
        },
        async sendForgotPassword(payload) {
            await axios.post('/auth/send-forgot-password', payload)
                .then((res) => {
                    notify({
                        title: 'Success',
                        message: res.data.message,
                        type: 'success',
                    });
                })
                .catch(err => {
                    notify({
                        title: 'Error',
                        text: err.response.data.message,
                        type: 'error',
                    });
                })
        },
        async logout() {
            await axios.post('/auth/logout')
                .then(() => {
                    localStorage.removeItem('dfauth');
                })
                .catch(err => {
                    notify({
                        title: 'Error',
                        text: err.response.data.message,
                        type: 'error',
                    });
                })
        }
    }
})