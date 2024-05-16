import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useNasStore = defineStore('nas', {
    state: () => ({

    }),
    getters: {

    },
    actions: {
        async storeAddonConfiguration(payload) {
            try {
                const res = await axios.post('/nas/addon/storeConfiguration', payload)

                notify({
                    title: 'Success',
                    text: res.data.message,
                    type: 'success',
                });

                return res;
            } catch (error) {
                notify({
                    title: 'Failed',
                    text: error.response.data.message,
                    type: 'error',
                });
                return error;
            }
        },
        async testConnection(payload) {
            try {
                const res = await axios.post('/nas/testConnection', payload)

                notify({
                    title: 'Success',
                    text: res.data.message,
                    type: 'success',
                });

                return res;
            } catch (error) {
                notify({
                    title: 'Failed',
                    text: error.response.data.message,
                    type: 'error',
                });
                return error;
            }

            
        },
        async initAddonSetting() {
            try {
                const res = await axios.get('/nas/addon/configuration')
                
                return res;
            } catch (error) {
                notify({
                    title: 'Failed',
                    text: error.response.data.message,
                    type: 'error',
                });

                return error;
            }

        }
    }
})