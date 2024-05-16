import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from 'axios';

const { notify } = useNotification();

export const useSettingStore = defineStore('setting', {
    state: () => ({

    }),
    getters: {

    },
    actions: {
        async initKanban() {
            try {
                const setting = await axios.get('/setting/kanban')
                
                return setting;
            } catch (error) {
                return error;
            }
        },
        async storeKanban(payload) {
            try {
                const response = await axios.post('/setting/kanban', {boards: payload.settings})

                notify({
                    title: 'Success',
                    text: response.data.message,
                    type: 'success',
                });

                return response;
            } catch (error) {
                if (error.response.status != 422) {
                    notify({
                        title: 'Failed',
                        text: error.response.data.message,
                        type: 'error',
                    });
                }

                return error;
            }
        }
    }
});