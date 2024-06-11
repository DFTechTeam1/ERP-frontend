import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from 'axios';
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useSettingStore = defineStore('setting', {
    state: () => ({
        appName: 'ERP',
    }),
    getters: {
        globalAppName: (state) => state.appName,
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
        },
        async getSettingByKeyAndCode(payload) {
            try {
                const resp = await axios.get(`/setting/${payload.code}/${payload.key}`);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getSetting(payload) {
            try {
                const resp = await axios.get(`/setting/${payload.code}`);

                if (payload.code == 'general') {
                    resp.data.data.forEach((elem) => {
                        if (elem.key == 'app_name')  {
                            this.appName = elem.value;
                        }
                    })
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async storeSetting(payload, type) {
            try {
                const resp = await axios.post(`/setting/${type}`, payload);

                if (type == 'general') {
                    this.appName = payload.app_name;
                }

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        }
    }
});