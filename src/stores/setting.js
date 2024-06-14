import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from 'axios';
import { showNotification } from "@/compose/notification";
import { useBreakToken } from "@/compose/breakToken";

const { notify } = useNotification();

export const useSettingStore = defineStore('setting', {
    state: () => ({
        appName: 'ERP',
        boardStartCalculated: null,
        kanbanList: [],
        addonSetting: [],
        kanbanSetting: [],
        generalSetting: [],
        emailSetting: [],
    }),
    getters: {
        globalAppName: (state) => state.appName,
        globalBoardCalculated: (state) => state.boardStartCalculated,
        globalKanbanList: (state) => state.kanbanList,
        globalAddonSetting: (state) => state.addonSetting,
        globalKanbanSetting: (state) => state.kanbanSetting,
        globalEmailSetting: (state) => state.emailSetting,
        globalGeneralSetting: (state) => state.generalSetting
    },
    actions: {
        setBoardCalculated() {
            this.boardStartCalculated = useBreakToken('board_start_calcualted');
        },
        async initAllSetting() {
            try {
                const resp = await axios.get('/setting');

                this.addonSetting = resp.data.data.addon;
                this.kanbanSetting = resp.data.data.kanban;
                this.generalSetting = resp.data.data.general;
                this.emailSetting = resp.data.data.email;
            } catch (error) {
                return error;
            }
        },
        async initKanban() {
            try {
                const setting = await axios.get('/setting/kanban')

                this.kanbanList = setting.data.data.boards;
                
                return setting;
            } catch (error) {
                return error;
            }
        },
        async storeKanban(payload) {
            try {
                const resp = await axios.post('/setting/kanban', {boards: payload.settings})

                this.addonSetting = resp.data.data.addon;
                this.kanbanSetting = resp.data.data.kanban;
                this.generalSetting = resp.data.data.general;
                this.emailSetting = resp.data.data.email;

                showNotification(resp.data.message);

                return resp;
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

                    localStorage.setItem('app_name', this.appName);
                }

                this.addonSetting = resp.data.data.addon;
                this.kanbanSetting = resp.data.data.kanban;
                this.generalSetting = resp.data.data.general;
                this.emailSetting = resp.data.data.email;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        setAppName() {
            this.appName = localStorage.getItem('app_name');
        }
    }
});