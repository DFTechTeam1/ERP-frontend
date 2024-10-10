import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useInventoriesStore = defineStore('inventories', {
    state: () => ({
        inventories: [],
        requestEquipments: [],
        totalRequestEquipment: 0,
        totalInventories: 0,
        errorValidation: null,
        storeDataResult: null,
        detailInventoryType: null,
    }),
    getters: {
        listOfInventories: (state) => state.inventories,
        listOfRequestEquipments: (state) => state.requestEquipments,
        totalOfInventories: (state) => state.totalInventories,
        totalOfRequestEquipment: (state) => state.totalRequestEquipment,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async requestEquipmentList(payload) {
            let params = {
                search: payload ? payload.filter : ''
            };

            await axios.get('/request-equipments', {
                params: params
            })
                .then((res) => {
                    this.requestEquipments = res.data.data;
                })
                .catch()
        },
        async initInventories(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.filter : ''
            };

            await axios.get('/inventories', {
                params: params
            })
                .then((res) => {
                    console.log('res', res.data.data.paginated);
                    this.inventories = res.data.data.paginated;
                    this.totalInventories = res.data.data.totalData;
                })
                .catch()
        },
        async updateData(payload, uid) {
            try {
                this.storeDataResult = await axios.post('/inventories/' + uid, payload)

                notify({
                    title: 'Success',
                    text: this.storeDataResult.data.message,
                    type: 'success',
                });
                return this.storeDataResult;
            } catch (error) {
                this.errorValidation = error.response.data.errors;
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
        async getAll(payload) {
            try {
                var params = {};
                if (payload) {
                  params = payload;
                }
                const resp = await axios.get('/inventories/getAll', {
                  params: params
                });

                return resp;
            } catch (error) {
                return error;
            }
        },
        async storeData(payload, uid = '') {
            try {
                if (uid) {
                    this.storeDataResult = await axios.post('/inventories/' + uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/inventories', payload)
                }

                notify({
                    title: 'Success',
                    text: this.storeDataResult.data.message,
                    type: 'success',
                });
                return this.storeDataResult;
            } catch (error) {
                this.erbulkDeleterorValidation = error.response.data.errors;
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
        async detailData(payload) {
            try {
                this.detailInventoryType = await axios.get('/inventories/' + payload.uid)
                return this.detailInventoryType;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/inventories/bulk', {
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
        async getListItem(payload) {
            const items = await axios.get(`inventories/${payload.uid}/items`)

            if (items.status < 300) {
                return items.data.data;
            }

            return [];
        },
        async importFile(payload) {
            try {
                const resp = await axios.post('/inventories/import', payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
    }
})
