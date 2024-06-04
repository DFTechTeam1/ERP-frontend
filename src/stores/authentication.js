import { defineStore } from "pinia";
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { tokenSetter } from "@/compose/tokenSetter";

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
            try {
                const resp = await axios.post('/auth/login', payload);    

                localStorage.setItem('dfauth', resp.data.data.token);

                tokenSetter();

                return resp
            } catch (error) {
                notify({
                    title: 'Error',
                    text: error.response.data.message,
                    type: 'error',
                });

                return error;
            }
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