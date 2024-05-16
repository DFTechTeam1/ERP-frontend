import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from 'axios';

const { notify } = useNotification();

export const useAddonStore = defineStore('addon', {
    state: () => ({
        addons: [],
        totalAddon: 0,
    }),
    getters: {
        listOfAddons: (state) => state.addons,
        totalOfAddon: (state) => state.totalAddon,
    },
    actions: {
        async initAddons(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/addon', {
                params: params
            })
                .then((res) => {
                    this.addons = res.data.data.paginated;
                    this.totalAddon = res.data.data.totalData;
                })
        },
        async initUpdatedAddons() {
            try {
                const resp = await axios.get('/addon/f/updates');

                return resp;
            } catch (error) {
                return error;
            }
        },
        async detail(payload) {
            try {
                const response = await axios.get('addon/' + payload.id);

                return response;
            } catch (error) {
                return error;
            }
        },
        async initFrontendAddons(payload) {
            try {
                let params = {
                    page: payload ? payload.page : 1,
                    itemsPerPage: payload ? payload.itemsPerPage : 10,
                };

                const response = await axios.get('/addon', {
                    params: params
                });

                return response;
            } catch (error) {
                return error;
            }
        },
        async askDeveloper(payload) {
            try {
                const response = await axios.post('/addon/askDeveloper', payload);

                notify({
                    title: 'Success',
                    text: response.data.message,
                    type: 'success',
                });
                
                return response;
            } catch (error) {
                return error;
            }
        },
        async getAllAddons() {
            try {
                const response = await axios.get('/addon/f/getAll')
                
                return response;
            } catch (error) {
                return error;
            }
        },
        async storeAddon(payload) {
            try {
                const response = await axios.post('/addon/nas', payload);

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
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/addon/bulk', {
                    ids: payload,
                });

                notify({
                    title: 'Success',
                    text: deleteResult.data.message,
                    type: 'success',
                });

                return deleteResult;
            } catch (error) {
                return error;
            }
        },
        async downloadData(payload) {
            try {
                const response = await axios.get('addon/download/' + payload.id + '/' + payload.type);
                
                return response;
            } catch (error) {
                return error;
            }
        },
        async upgradeAddon(payload, addonId) {
            try {
                const resp = await axios.post('/addon/upgrades/' + addonId, payload);

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

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
        }
    }
})