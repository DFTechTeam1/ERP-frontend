import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useSupplierStore = defineStore('supplier', {
    state: () => ({
        suppliers: [],
        allSuppliers: [],
        totalSuppliers: 0,
        errorValidation: null,
        storeDataResult: null,
        detailSupplier: null,
    }),
    getters: {
        listOfSuppliers: (state) => state.suppliers,
        listOfAllSuppliers: (state) => state.allSuppliers,
        totalOfSuppliers: (state) => state.totalSuppliers,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async initSuppliers(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/suppliers', {
                params: params
            })
                .then((res) => {
                    this.suppliers = res.data.data.paginated;
                    this.totalSuppliers = res.data.data.totalData;
                })
                .catch()
        },
        async getAllSuppliers() {
            await axios.get('/suppliers/all')
                .then((res) => {
                    this.allSuppliers = res.data.data;
                })
                .catch()
        },
        async storeData(payload) {
            try {
                if (payload.detailData) {
                    this.storeDataResult = await axios.put('/suppliers/' + payload.detailData.uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/suppliers', payload)
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
                this.detailSupplier = await axios.get('/suppliers/' + payload.uid)
                return this.detailSupplier;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/suppliers/bulk', {
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
                const resp = await axios.post('/suppliers/import', payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
    }
})