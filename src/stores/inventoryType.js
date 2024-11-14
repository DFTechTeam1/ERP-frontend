import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useInventoryTypeStore = defineStore('inventoryType', {
    state: () => ({
        inventoryTypes: [],
        allInventoryTypes: [],
        totalTypes: 0,
        errorValidation: null,
        storeDataResult: null,
        detailInventoryType: null,
    }),
    getters: {
        listOfInventoryTypes: (state) => state.inventoryTypes,
        inventoryTypesAll: (state) => state.allInventoryTypes,
        totalOfInventoryTypes: (state) => state.totalTypes,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async initInventoryTypes(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/inventory-types', {
                params: params
            })
                .then((res) => {
                    this.inventoryTypes = res.data.data.paginated;
                    this.totalTypes = res.data.data.totalData;
                })
                .catch()
        },
        async getAllInventoryTypes() {
            await axios.get('/inventory-types/all')
                .then((res) => {
                    this.allInventoryTypes = res.data.data;
                })
                .catch()
        },
        async storeData(payload) {
            try {
                if (payload.detailData) {
                    this.storeDataResult = await axios.put('/inventory-types/' + payload.detailData.uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/inventory-types', payload)
                }
                notify({
                    title: 'Success',
                    text: this.storeDataResult.data.message,
                    type: 'success',
                });
                return this.storeDataResult;
            } catch (error) {
                this.errorValidation = error.response.data.errors;
                return error;
            }
        },
        async detailData(payload) {
            try {
                this.detailInventoryType = await axios.get('/inventory-types/' + payload.uid)
                return this.detailInventoryType;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/inventory-types/bulk', {
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
        async importFile(payload) {
            try {
                const resp = await axios.post('/inventory-types/import', payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
    }
})