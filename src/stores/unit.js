import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useUnitStore = defineStore('unit', {
    state: () => ({
        units: [],
        allUnits: [],
        totalUnits: 0,
        errorValidation: null,
        storeDataResult: null,
        detailUnit: null,
    }),
    getters: {
        listOfUnits: (state) => state.units,
        listOfAllUnits: (state) => state.allUnits,
        totalOfUnits: (state) => state.totalUnits,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async initUnits(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/units', {
                params: params
            })
                .then((res) => {
                    this.units = res.data.data.paginated;
                    this.totalUnits = res.data.data.totalData;
                })
                .catch()
        },
        async getAllUnits() {
            await axios.get('/units/all')
                .then((res) => {
                    this.allUnits = res.data.data;
                })
                .catch()
        },
        async storeData(payload) {
            try {
                if (payload.detailData) {
                    this.storeDataResult = await axios.put('/units/' + payload.detailData.uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/units', payload)
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
                this.detailUnit = await axios.get('/units/' + payload.uid)
                return this.detailUnit;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/units/bulk', {
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
                const resp = await axios.post('/units/import', payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
    }
})