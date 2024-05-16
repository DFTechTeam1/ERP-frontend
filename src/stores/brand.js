import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useBrandStore = defineStore('brand', {
    state: () => ({
        brands: [],
        allBrands: [],
        totalBrands: 0,
        errorValidation: null,
        storeDataResult: null,
        detailBrand: null,
    }),
    getters: {
        listOfBrands: (state) => state.brands,
        listOfAllBrands: (state) => state.allBrands,
        totalOfBrands: (state) => state.totalBrands,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async initBrands(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/brands', {
                params: params
            })
                .then((res) => {
                    this.brands = res.data.data.paginated;
                    this.totalBrands = res.data.data.totalData;
                })
                .catch()
        },
        async getAllBrands() {
            await axios.get('/brands/all')
                .then((res) => {
                    this.allBrands = res.data.data;
                })
                .catch()
        },
        async storeData(payload) {
            try {
                if (payload.detailData) {
                    this.storeDataResult = await axios.put('/brands/' + payload.detailData.uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/brands', payload)
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
                this.detailBrand = await axios.get('/brands/' + payload.uid)
                return this.detailBrand;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/brands/bulk', {
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
        }
    }
})