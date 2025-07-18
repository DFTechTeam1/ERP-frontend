import { defineStore } from "pinia";
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { tokenSetter } from "@/compose/tokenSetter";
import { useBreakToken } from "@/compose/breakToken";
import { showNotification } from "@/compose/notification";
import apiClient from '@/plugins/axiosClient'

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
                localStorage.setItem('dfreportauth', resp.data.data.reportingToken);

                var appName = useBreakToken('app_name');
                if (appName) {
                    localStorage.setItem('app_name', appName);
                }

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
        },
        async forgotPassword(payload) {
            try {
                const resp = await axios.post('/auth/forgotPassword', payload)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async resetPassword(payload) {
            try {
                const resp = await axios.post('/auth/resetPassword', payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        }
    }
})
